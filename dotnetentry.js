const main = require('./main');
const logger = require('./logger');

module.exports = async (callback, options) => {
  try {
    const outputPath = await main(options);
    callback(outputPath);
  } catch (error) {
    logger.error('Error from dotnetentry.js', error);
  }
};
