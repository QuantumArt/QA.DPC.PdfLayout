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

const mapProduct = async (options) => {
  const rawData = await jsonfilePromised.readFile(options.tariffJsonPath);
  const mapData = await readFile(`${path.normalize(options.mapperPath)}/index.js`, 'utf-8');
  console.log(options.mapperPath);
  let data;
  try {
    const secureMap = vm.run(mapData);
    data = secureMap(rawData);
  } catch (error) {
    logger.error('Error with mapper', error);
    throw error;
  }
  return data;
};

const compile = async (options) => {
  try {
    const data = await mapProduct(options);
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

module.exports.compile = compile;
module.exports.mapProduct = mapProduct;
