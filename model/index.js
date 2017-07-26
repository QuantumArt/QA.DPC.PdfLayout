const fs = require('fs');
const path = require('path');
const _ = require('lodash/lang');
const config = require('config');
const cons = require('consolidate');
const promisifyStream = require('stream-to-promise');
const logger = require('../logger');

const render = async (tariffName, data, engine) => {
  try {
    // check if arguments correct
    if (!_.isString(tariffName)) {
      throw new TypeError('tariffName must be a string');
    }
    if (!_.isString(engine)) {
      throw new TypeError('engine must be a string');
    }

    const engineExtension = config.get(`engines.${engine}.ext`);
    const enginesFilePath = path.join(
      config.get(`engines.${engine}.path`),
      tariffName,
      `index.${engineExtension}`,
    );
    const outputFilePath = path.join(
      config.get('output'),
      tariffName,
      'index.html',
    );

    try {
      // compile html string
      const htmlString = await cons[engine](enginesFilePath, {
        data,
        self: true,
      });

      // write stream asynchroniusly
      const writeStream = fs.createWriteStream(outputFilePath);
      promisifyStream(writeStream);

      writeStream.on('finish', () => console.log('render complete'));

      await writeStream.write(htmlString);
      writeStream.end();
    } catch (error) {
      // ENOENT catched here as well
      logger.error(error);
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = render;
