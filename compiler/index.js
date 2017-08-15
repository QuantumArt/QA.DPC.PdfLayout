const logger = require('../logger');
const render = require('../model');
const jsonfilePromised = require('jsonfile-promised');
const stringifyObject = require('stringify-object');

// const options = {
//   tariffJsonPath: '../tariffs/tariff_1234_4567.json',
//   mapperPath: '../mappers/mapper_1234_4567',
//   templatePath: '../views/pug/template_1234_4567',
//   outputDirName: 'tariff_some_hash_from_mapper_and_tariff_and_template',
//   engine: 'pug',
// };

const compile = async (options) => {
  try {
    const mapData = require(options.mapperPath); // eslint-disable-line global-require
    const rawData = await jsonfilePromised.readFile(options.tariffJsonPath);
    const data = mapData(rawData);
    await render({
      engine: options.engine,
      templatePath: options.templatePath,
      outputDirName: options.outputDirName,
      pdf: false,
    }, data);
  } catch (error) {
    logger.error(`Error from compiler with options: ${stringifyObject(options)}: ${error.message}`, error);
  }
};

module.exports = compile;
