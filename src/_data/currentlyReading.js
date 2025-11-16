require("dotenv").config();
const { fetchCurrentlyReading } = require("../js/returnsCurrentlyReading");

module.exports = async function () {
//uses .env
  return await fetchCurrentlyReading(process.env.GOODREADS_USER_ID);
};
