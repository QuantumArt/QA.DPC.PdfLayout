const fs = require('fs');
const mkdirp = require('mkdirp-promise');
const path = require('path');
const _ = require('lodash/lang');
const promisifyStream = require('stream-to-promise');
const config = require('config');
const cons = require('consolidate');
const logger = require('../logger');

const render = async (tariffName, data, engine, pdf) => {
  try {
    // check if arguments correct
    if (!_.isString(tariffName)) {
      throw new TypeError('tariffName must be a string');
    }
    if (!_.isString(engine)) {
      throw new TypeError('engine must be a string');
    }
    if (pdf && !_.isBoolean(pdf)) {
      throw new TypeError('pdf flag must be a boolean');
    }


    const engineExtension = config.get(`engines.${engine}.ext`);
    const engineFilePath = path.join(
      config.get(`engines.${engine}.path`),
      tariffName,
      `index.${engineExtension}`,
    );
    const outputPath = path.join(config.get('output'), tariffName);
    const outputHtmlPath = path.join(
      config.get('output'),
      tariffName,
      'index.html',
    );
    const outputJsonPath = path.join(
      config.get('output'),
      tariffName,
      `${tariffName}.json`,
    );

    // compile html string
    const htmlString = await cons[engine](engineFilePath, {
      data,
      self: true,
    });
    const jsonString = JSON.stringify(data);

    // write output streams asynchroniusly
    await mkdirp(outputPath);
    const htmlWriteStream = fs.createWriteStream(outputHtmlPath, 'utf-8');
    const jsonWriteStream = fs.createWriteStream(outputJsonPath, 'utf-8');
    const htmlWritePromise = promisifyStream(htmlWriteStream.write(htmlString));
    const jsonWritePromise = promisifyStream(jsonWriteStream.write(jsonString));

    htmlWriteStream.on('finish', () => console.log('HTML render complete'));
    jsonWriteStream.on('finish', () => console.log('JSON render complete'));

    await Promise.all([htmlWritePromise, jsonWritePromise]);
    htmlWriteStream.end();
    jsonWriteStream.end();
  } catch (error) {
    logger.error('Error from model/index.js', error);
  }
};

module.exports = render;
