const lockFile = require('lockfile');
const fetch = require('node-fetch');
const unzipper = require('unzipper');
const fs = require('fs');
const promisePipe = require('promisepipe');
const path = require('path');
const config = require('config');
const logger = require('../logger');
const mkdirp = require('mkdirp-promise');


const lockfilesDir = path.resolve(config.get('locks.root'));
const completedMarkersDir = path.join(config.get('locks.completedroot'));
const zipdownloadPath = path.resolve(config.get('zipdownloadpath'));

(async () => {
  await mkdirp(lockfilesDir);
  await mkdirp(completedMarkersDir);
  await mkdirp(zipdownloadPath);
})();

const fetchAndSave = async (url, destinationPath) => {
  const fetchRes = await fetch(url);
  console.log(`downloaded ${url}`);
  return promisePipe(fetchRes.body, fs.createWriteStream(destinationPath));
};

const unzip = async (zipFilePath, destPath) =>
  promisePipe(fs.createReadStream(zipFilePath), unzipper.Extract({
    path: destPath,
  }));

const createMarkerFile = (markerPath) => {
  console.log(`creating marker ${markerPath}`);
  fs.closeSync(fs.openSync(markerPath, 'w'));
  console.log(`created marker ${markerPath}`);
};

const checkExists = (key) => {
  const completedMarkerPath = path.join(completedMarkersDir, key);
  // const inprogressMarkerPath = path.join(lockfilesDir, key);
  return {
    // inprogress: fs.existsSync(inprogressMarkerPath),
    completed: fs.existsSync(completedMarkerPath),
  };
};

// var options = {
//     lockKey : 'template_pug_1488_1502106030', 
//     fileUrl: 'http://blabla/template_1488',
//     isZip : true,
//     isFolder: true,
//     destinationRootFolder: '/views/pug/',
//     destinationName : 'template_pug_1488_1502106030'
// };


const download = async options => new Promise((async (resolve, reject) => {
  try {
    const markerKey = `${options.lockKey}.lock`;
    let existStatus = checkExists(markerKey);
    const destinationPath = path.join(options.destinationRootFolder, options.destinationName);
    if (options.isFolder) {
      await mkdirp(destinationPath);
    } else {
      await mkdirp(options.destinationRootFolder);
    }
    console.log(`first check: completed: ${existStatus.completed}`);
    if (existStatus.completed) {
      resolve(true);
      return;
    }
    const inprogressMarkerPath = path.join(lockfilesDir, markerKey);
    // createMarkerFile(inprogressMarkerPath);
    const lockfileOptions = {
      stale: config.get('locks.stale'),
      retries: config.get('locks.retries'),
    };
    lockFile.lock(inprogressMarkerPath, lockfileOptions, async (err) => {
      if (err) {
        console.log(`lock ${inprogressMarkerPath} failed`);
        reject(err);
      }

      console.log(`acquired lock on ${inprogressMarkerPath}`);
      existStatus = checkExists(markerKey);
      console.log(`second check: completed: ${existStatus.completed}`);
      if (existStatus.completed) {
        console.log('completed, releasing');
        lockFile.unlock(inprogressMarkerPath);
        resolve(true);
        return;
      }
      const saveFilePath = options.isZip ? path.join(zipdownloadPath, `${options.lockKey}.zip`) : destinationPath;
      await fetchAndSave(options.fileUrl, saveFilePath);
      if (options.isZip) {
        await unzip(saveFilePath, destinationPath);
      }
      if (options.izZip) {
        fs.unlinkSync(saveFilePath);
      }

      const completedMarkerPath = path.join(completedMarkersDir, markerKey);
      createMarkerFile(completedMarkerPath);
      lockFile.unlock(inprogressMarkerPath);
      resolve(true);
    });
  } catch (e) {
    logger.error('error while downloading', e);
    reject(e);
  }
}));

module.exports = download;
