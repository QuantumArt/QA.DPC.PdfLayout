const unzipper = require('unzipper');
const fs = require('fs');
const promisePipe = require('promisepipe');

const unzip = async (zipFilePath, destinationPath) =>
  promisePipe(fs.createReadStream(zipFilePath), unzipper.Extract({
    path: destinationPath,
  }));

module.exports = unzip;
