const axios = require("axios");

async function fetchBookCover(book) {
  try {
    const res = await axios.get(
      `https://bookcover.longitood.com/bookcover?book_title=${book.title}&author_name=${book.author}`
    );
    if (res.data.url) {
      return res.data.url;
    }

    console.log("title failed", book.title, book.isbn);

    if (book.isbn) {
      const resISBN = await axios.get(
        `https://bookcover.longitood.com/bookcover?isbn=978${book.isbn}`
      );
      if (resISBN.data.url) {
        return resISBN.data.url;
      }
    }
  } catch (err) {
    console.log(`Error fetching cover for: ${book.title}`, err);
  }
}

module.exports = { fetchBookCover };