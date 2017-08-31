const path = require('path');
const fs = require('fs');
const util = require('util');
const jsonfilePromised = require('jsonfile-promised');
const stringifyObject = require('stringify-object');
const { NodeVM } = require('vm2');
const lodash = require('lodash');
const render = require('../model');
const logger = require('../logger');

const readFile = util.promisify(fs.readFile);
const vm = new NodeVM({
  console: 'inherit',
  sandbox: { lodash },
});

// const options = {
//   tariffJsonPath: '../tariffs/tariff_1234_4567.json',
//   mapperPath: '../mappers/mapper_1234_4567',
//   templatePath: '../views/pug/template_1234_4567',
//   outputDirName: 'tariff_some_hash_from_mapper_and_tariff_and_template',
//   engine: 'pug',
// };

const compile = async (options) => {
  try {
    /* eslint-disable global-require */
    const rawData = await jsonfilePromised.readFile(options.tariffJsonPath);
    const mapData = await readFile(path.normalize(options.mapperPath), 'utf-8');
    let data;
    try {
      const secureMap = vm.run(mapData);
      data = secureMap(rawData);
    } catch (error) {
      logger.error('Error with mapper', error);
      throw error;
    }
    await render({
      engine: options.engine,
      templatePath: options.templatePath,
      outputDirName: options.outputDirName,
      pdf: false,
    }, data);
  } catch (error) {
    logger.error(`Error from compiler with options: ${stringifyObject(options)}: ${error.message}`, error);
    throw error;
  }
};

module.exports = compile;
