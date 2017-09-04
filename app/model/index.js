const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp-promise');
const _ = require('lodash/lang');
const config = require('config');
const str = require('string-to-stream');
const stringifyObject = require('stringify-object');
const promisePipe = require('promisepipe');
const cons = require('consolidate');
const handlebars = require('handlebars');
const logger = require('../logger');

const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

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
    const outputHtmlPath = path.join(
      outputPath,
      'index.html',
    );
    const outputJsonPath = path.join(
      outputPath,
      'mappedData.json',
    );

    // register partials
    const partials = {};
    const partialsList = await readDir(`${options.templatePath}/parts`);
    partialsList.forEach((partial) => {
      const partialInfo = path.parse(partial);
      const name = partialInfo.name;
      partials[name] = `parts/${name}`;
    });

    // register custom engine helpers/filters
    if (options.engine === 'handlebars') {
      cons.requires.handlebars = handlebars;
      cons.requires.handlebars.registerHelper('ifEq', function checkIfEqual(arg1, arg2, opts) {
        return (arg1 === arg2) ? opts.fn(this) : opts.inverse(this);
      });
      cons.requires.handlebars.registerHelper('inc', value => parseInt(value, 10) + 1);
    }

    // prepare strings
    const cssString = await readFile(`${options.templatePath}/styles/main.css`, 'utf-8');
    const htmlString = await cons[options.engine](engineFilePath, {
      data,
      style: cssString,
      self: true, // pug specific
      partials, // for all engines that can't include partials at runtime
    });

    const jsonString = JSON.stringify(data);

    // write output streams asynchroniusly
    await mkdirp(outputPath);
    const htmlWriteStream = fs.createWriteStream(outputHtmlPath, 'utf-8');
    const jsonWriteStream = fs.createWriteStream(outputJsonPath, 'utf-8');

    const htmlWritePromise = promisePipe(str(htmlString), htmlWriteStream);
    const jsonWritePromise = promisePipe(str(jsonString), jsonWriteStream);

    htmlWriteStream.on('finish', () => console.log('HTML render complete'));
    jsonWriteStream.on('finish', () => console.log('JSON render complete'));

    await Promise.all([htmlWritePromise, jsonWritePromise]);
    console.log('render complete');
    return;
  } catch (error) {
    logger.error('Error from model', error);
    throw error;
  }
};

module.exports = render;
