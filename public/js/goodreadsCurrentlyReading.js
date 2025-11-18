const axios = require("axios");
const cheerio = require("cheerio");

//i wrote this function to be dynamic, so you can use this yourself with your own userID, just call fetchCurrentlyReading with your own goodreads userID
async function fetchCurrentlyReading(userID) {
  try {
    const res = await axios.get(
      `https://www.goodreads.com/review/list?v=2&id=${userID}&shelf=currently-reading&per_page=1&sort=date_updated`
    );
    const html = res.data;
    const $ = cheerio.load(html);
    //this might break if goodreads ever changes site/html layout
    const cover = $(".js-tooltipTrigger.tooltipTrigger").attr("img");
    console.log("Currently reading cover URL:", cover);
  } catch (error) {
    console.error("Error fetching currently reading:", error.status, userID);
    return null;
  }
}

fetchCurrentlyReading(167167687)