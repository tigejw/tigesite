const fs = require("fs");
const csv = require("csv-parse/sync");
const { fetchBookCovers } = require("./coverFetch.js");

//1: export goodreads csv from goodreads https://www.goodreads.com/review/import
//2: enhance it with https://github.com/kevinsawicki/goodreads-export
//3: place enhanced goodreads_library_export.csv in utils/booksFormatting/_data/
//4: run `node utils/booksFormatting/js/goodreadsExportToJSON.js`
//5: find your enhanced and formatted goodreads_data.json in src/_data/

const booksCSV = fs.readFileSync(
  "utils/booksFormatting/_data/goodreads_library_export.csv",
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
    //some isbns are missing in goodreads export \o/
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
    //cover property added later by fetchBookCovers
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

  //adds covers
  const readBooksWithCovers = await fetchBookCovers(readBooks);

  //this function sorts the books by most recently read
  //you can change va and vb to a.myRating and b.myRating to sort by rating instead
  //change the vb-va to va-vb to change from desc to asc 
  const sortedreadBooksByDate = readBooksWithCovers.sort((a, b) => {
    const toDate = (dmy) => {
      if (!dmy) return new Date(0);
      const [d, m, y] = dmy.split(".").map(Number);
      return new Date(y, m - 1, d);
    }
    let va = toDate(a.readDates[1]) || "00.00.0000";
    let vb = toDate(b.readDates[1]) || "00.00.0000";

    return vb - va;
  });

  const booksData = {
    books: sortedreadBooksByDate,
  };

  fs.writeFileSync(
    "./src/_data/goodreads_data.json",
    JSON.stringify(booksData, null, 2)
  );
}

processBooks(books);
