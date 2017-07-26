const fetch = require('node-fetch');
const logger = require('../logger');

async function compiler(url) {
  let rawJSON;
  try {
    const response = await fetch(url);
    rawJSON = await response.json();
    return rawJSON;
  } catch (error) {
    logger.error(error);
    return false;
  }
}

module.exports = compiler;
