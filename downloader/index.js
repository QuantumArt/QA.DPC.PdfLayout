const lockFile = require('lockfile');
const fs = require('fs');
const path = require('path');
const config = require('config');
const mkdirp = require('mkdirp-promise');
const logger = require('../logger');
const checkCompleted = require('./checkCompleted');
const download = require('./download');
const unzip = require('./unzip');
const util = require('util');

const promisifiedLock = util.promisify(lockFile.lock);

const lockfilesDir = path.resolve(config.get('locks.root'));
const completedMarkersDir = path.join(config.get('locks.completedroot'));
const zipdownloadPath = path.resolve(config.get('zipdownloadpath'));


const createMarkerFile = (markerPath) => {
  console.log(`creating marker ${markerPath}`);
  fs.closeSync(fs.openSync(markerPath, 'w'));
  console.log(`created marker ${markerPath}`);
};


// var options = {
//     lockKey : 'template_pug_1488_1502106030', 
//     fileUrl: 'http://blabla/template_1488',
//     isZip : true,
//     isFolder: true,
//     destinationRootFolder: '/views/pug/',
//     destinationName : 'template_pug_1488_1502106030'
// };


const workflow = async (options) => {
  let locked = false;
  const markerKey = options.lockKey;
  const inprogressMarkerPath = path.join(lockfilesDir, markerKey);

  try {
    let existStatus = await checkCompleted(markerKey);
    const destinationPath = path.join(options.destinationRootFolder, options.destinationName);
    await mkdirp(lockfilesDir);
    await mkdirp(completedMarkersDir);
    await mkdirp(zipdownloadPath);
    if (options.isFolder) {
      await mkdirp(destinationPath);
    } else {
      await mkdirp(options.destinationRootFolder);
    }
    console.log(`first check: completed: ${existStatus}`);
    if (existStatus) {
      return;
    }
    const lockfileOptions = {
      stale: config.get('locks.stale'),
      retries: config.get('locks.retries'),
    };


    await promisifiedLock(inprogressMarkerPath, lockfileOptions);
    locked = true;

    console.log(`acquired lock on ${inprogressMarkerPath}`);
    existStatus = await checkCompleted(markerKey);
    console.log(`second check: completed: ${existStatus}`);
    if (existStatus) {
      console.log('completed, releasing');
      lockFile.unlock(inprogressMarkerPath);
      return;
    }
    const saveFilePath = options.isZip ? path.join(zipdownloadPath, `${options.lockKey}.zip`) : destinationPath;
    await download(options.fileUrl, saveFilePath);
    if (options.isZip) {
      await unzip(saveFilePath, destinationPath).catch((e) => {
        logger.error(`Error while unzipping ${saveFilePath}`, e);
        throw new Error(`Error while unzipping ${saveFilePath}`);
      });
    }
    if (options.isZip) {
      fs.unlinkSync(saveFilePath);
    }

    const completedMarkerPath = path.join(completedMarkersDir, markerKey);
    createMarkerFile(completedMarkerPath);
    lockFile.unlock(inprogressMarkerPath);
  } catch (e) {
    throw e;
  } finally {
    if (locked) {
      lockFile.unlock(inprogressMarkerPath);
    }
  }
};

module.exports = workflow;
