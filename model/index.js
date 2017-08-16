const fs = require('fs');
const util = require('util');
const mkdirp = require('mkdirp-promise');
const path = require('path');
const _ = require('lodash/lang');
const config = require('config');
const cons = require('consolidate');
const str = require('string-to-stream');
const stringifyObject = require('stringify-object');
const promisePipe = require('promisepipe');
const juice = require('juice');
const logger = require('../logger');

const readFile = util.promisify(fs.readFile);

// const options = {
//   engine: 'pug',
//   templatePath: './Views/pug/template_12345_678',
//   outputDirName: 'tariff_some_hash_from_mapper_and_tariff_and_template'
//   pdf: true
// };

const render = async (options, data) => {
  try {
    console.log(`render options: ${stringifyObject(options)}`);
    // check if arguments correct
    if (!_.isString(options.templatePath)) {
      throw new TypeError('templatePath');
    }
    if (!_.isString(options.engine)) {
      throw new TypeError('engine must be a string');
    }
    if (options.pdf && !_.isBoolean(options.pdf)) {
      throw new TypeError('pdf flag must be a boolean');
    }

    const engineExtension = config.get(`engines.${options.engine}.ext`);
    const engineFilePath = path.join(
      options.templatePath,
      `index.${engineExtension}`,
    );

    const outputPath = path.join(config.get('output'), options.outputDirName);
    console.log(outputPath);

    const outputHtmlPath = path.join(
      outputPath,
      'index.html',
    );

    const outputJsonPath = path.join(
      outputPath,
      'mappedData.json',
    );

    // compile strings
    const htmlString = await cons[options.engine](engineFilePath, {
      data,
      self: true,
    });
    const cssString = await readFile(`${options.templatePath}/styles/main.css`, 'utf-8');
    const styledHtmlString = juice.inlineContent(htmlString, cssString);
    const jsonString = JSON.stringify(data);

    // write output streams asynchroniusly
    await mkdirp(outputPath);
    const htmlWriteStream = fs.createWriteStream(outputHtmlPath, 'utf-8');
    const jsonWriteStream = fs.createWriteStream(outputJsonPath, 'utf-8');
    // const htmlWritePromise = promisifyStream(htmlWriteStream.write(htmlString));
    // const jsonWritePromise = promisifyStream(jsonWriteStream.write(jsonString));
    const htmlWritePromise = promisePipe(str(styledHtmlString), htmlWriteStream);
    const jsonWritePromise = promisePipe(str(jsonString), jsonWriteStream);

    htmlWriteStream.on('finish', () => console.log('HTML render complete'));
    jsonWriteStream.on('finish', () => console.log('JSON render complete'));

    await Promise.all([htmlWritePromise, jsonWritePromise]);
    console.log('finish waiting streams');
    // htmlWriteStream.end();
    // jsonWriteStream.end();
    return;
  } catch (error) {
    logger.error('Error from model', error);
  }
};

module.exports = render;
