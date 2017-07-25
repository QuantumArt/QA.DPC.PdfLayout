const fetch = require('node-fetch');
const logger = require('../logger');
const render = require('../model');

async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    render('test', 'pug', { user: 'YOU' });
    console.log(data);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = getData;
