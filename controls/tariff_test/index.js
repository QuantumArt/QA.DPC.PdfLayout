const logger = require('../../logger');
const loadData = require('../../utils/loadData');
const render = require('../../model');
const mapData = require('./mapper');

const compile = async (tariffName, url, engine) => {
  try {
    const rawData = await loadData(url);
    const data = mapData(rawData);
    render(tariffName, data, engine);
  } catch (error) {
    logger.error(`Error from ${tariffName}: ${error.message}`, error);
  }
};

module.exports = compile;
