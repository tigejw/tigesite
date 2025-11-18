//this file takes enhanced goodreads export cvs from
//https://github.com/kevinsawicki/goodreads-export
//and converts them to a formatted json file
//place goodreads_library_export.csv in src/_data/ and run `node src/js/goodreadsExportToJSON.js`
//to update goodreads_data.json

//need to add covers? find a book api with isbns???
//not all ibsns in goodreads export, find one with title author search

//for now all covers are 20000 leagues!

const fs = require("fs");
const csv = require("csv-parse/sync");
const { fetchBookCovers } = require("./coverFetch.js");
const booksCSV = fs.readFileSync(
  "./src/_data/goodreads_library_export.csv",
  "utf8"
);

function formatYMDToDMY(dateStr) {
  if (!dateStr) return dateStr;
  const m = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : dateStr.trim();
}

const records = csv.parse(booksCSV, {
  columns: true,
  skip_empty_lines: true,
});

const books = records.map((record) => {
  return {
    bookID: record["Book Id"],
    title: record.Title,
    author: record.Author,
    originalPublicationYear:
      Number(record["Original Publication Year"]) ||
      Number(record["Year Published"]) ||
      null,
    additionalAuthors: record["Additional Authors"] || null,
    //missing some isbns, could be issue if using to search for thumbnails?
    isbn: record.ISBN.replace('="', "").replace('"', "") || null,
    myRating: Number(record["My Rating"]) || null,
    pages: Number(record["Number of Pages"]) || null,
    myReview: record["My Review"],
    exclusiveShelf: record["Exclusive Shelf"] || null,
    bookshelvesWithPositions: record["Bookshelves with positions"]
      ? record["Bookshelves with positions"]
          .split(",")
          .map((s) => s.trim())
          .map((t) => {
            const [name, position] = t.split(" (#");
            return {
              name,
              position: position ? position.replace(")", "") : null,
            };
          })
      : [],
    readDates: record.read_dates
      ? record.read_dates
          .split(",")
          .map((s) => s.trim())
          .map(formatYMDToDMY)
      : [],
    //20000 leagues cover
    // cover:
    //   "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1324740102l/834333._SY75_.jpg",
  };
});

books.forEach((book) => {
  if (book.bookshelvesWithPositions.some((shelf) => shelf.name === "4-5")) {
    book.myRating = 4.5;
  }
  if (book.bookshelvesWithPositions.some((shelf) => shelf.name === "3-5")) {
    book.myRating = 3.5;
  }
  if (book.bookshelvesWithPositions.some((shelf) => shelf.name === "2-5")) {
    book.myRating = 2.5;
  }
});

async function processBooks() {
  //filters only read list - change if wanting to do something with to-read
  const readBooks = books.filter((book) => book.exclusiveShelf === "read");

  //api call for covers
  const readBooksWithCovers =  await fetchBookCovers(readBooks);

  const booksData = {
    books: readBooksWithCovers,
  };

  fs.writeFileSync(
    "./src/_data/goodreads_data.json",
    JSON.stringify(booksData, null, 2)
  );
}

processBooks(books)
