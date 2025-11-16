const axios = require("axios");
const cheerio = require("cheerio");

//i wrote this function to be dynamic, so you can use this yourself with your own userID, 
// just call fetchCurrentlyReading(userID) with your own goodreads userID
async function fetchCurrentlyReading(userID) {
  try {
    const res = await axios.get(
      `https://www.goodreads.com/review/list?v=2&id=${userID}&shelf=currently-reading&per_page=1&sort=date_updated`
    );
    const html = res.data;
    const $ = cheerio.load(html);

    //this might break if goodreads ever changes site/html layout
    const $book = $("tr.bookalike.review").first();
    const title = $book.find("td.field.title a").text().trim() || null;
    const cover = $book.find("td.field.cover img").attr("src") || null;
    const author = $book.find("td.field.author a").text().trim() || null;
    
    return {
      title,
      cover,
      author
    }
  } catch (error) {
    console.error("Error fetching currently reading:", error.status, userID);
    return null;
  }
}

module.exports = { fetchCurrentlyReading };
