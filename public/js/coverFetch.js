const axios = require("axios");
const cheerio = require("cheerio");


async function fetchCover(bookID) {
  try {
    const res = await axios.get(
      "https://www.goodreads.com/book/show/" + bookID
    );
    const html = res.data;
    const $ = cheerio.load(html);
    //this might break if goodreads ever changes site/html layout
    const cover = $(".BookCover__image img").attr("src") ||   $("img.ResponsiveImage").attr("src");
    return cover;
  } catch (error) {
    console.error("Error fetching cover:", error.status, bookID);
    return null;
  }
}
async function fetchBookCovers(books) {
  let progress = 0
  console.log("Fetching covers for", books.length, "books... this could take a minute");
  for (const book of books) {
    const cover = await fetchCover(book.bookID);
    if (cover) {
      progress ++;
      console.log(`Fetched cover ${progress} of ${books.length}: ${cover}`);
      book.cover = cover;
    } else {
      console.log(`Failed to fetch cover ${progress} for:`, book.bookID);
    }
  }
  return books;
}

module.exports = { fetchBookCovers };
