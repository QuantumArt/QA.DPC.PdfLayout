const fetch = require('node-fetch');

async function loadData(url) {
  const response = await fetch(url);
  const rawJSON = response.json();

  return rawJSON;
}

module.exports = loadData;
