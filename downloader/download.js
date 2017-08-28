const fetch = require('node-fetch');
const promisePipe = require('promisepipe');
const fs = require('fs');

const fetchAndSave = async (url, destinationPath) => {
  const fetchRes = await fetch(url);
  if (fetchRes.status !== 200) {
    throw new Error(`erorr while downloading ${url}: ${fetchRes.status}`);
  }
  console.log(`downloaded ${url}`);
  return promisePipe(fetchRes.body, fs.createWriteStream(destinationPath));
};

module.exports = fetchAndSave;
