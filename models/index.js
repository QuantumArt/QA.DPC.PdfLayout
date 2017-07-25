const fs = require('fs');
const path = require('path');
const config = require('config');
const cons = require('consolidate');
const promisifyStream = require('stream-to-promise');
const logger = require('../logger');

const render = async (fileName, engine, data) => {
  try {
    // check if arguments correct
    if (typeof fileName !== 'string') {
      throw new TypeError('engine must be a string');
    } else if (typeof engine !== 'string') {
      throw new TypeError('filename must be a string');
    }

    const viewsPath = path.join(config.get('views.pug'), `${fileName}.pug`);
    const outputPath = path.join(config.get('output'), `${fileName}.html`);
    const writeStream = fs.createWriteStream(outputPath);
    writeStream.on('finish', () => console.log('render complete'));

    try {
      // compile html string
      const htmlString = await cons[engine](viewsPath, {
        data,
        self: true,
      });

      // write stream asynchroniusly
      promisifyStream(writeStream);
      await writeStream.write(htmlString);
      writeStream.end();
    } catch (error) {
      logger.error(error);
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = render;
