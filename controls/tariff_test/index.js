const loadData = require('../../utils/loadData');
const render = require('../../model');
const mapData = require('./mapper');

const compile = async (tariffName, url, engine) => {
  const rawData = await loadData(url);
  const data = mapData(rawData);
  render(tariffName, data, engine);
};

module.exports = compile;

