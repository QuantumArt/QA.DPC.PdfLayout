const fs = require('fs');
const path = require('path');
const config = require('config');

const completedMarkersDir = path.join(config.get('locks.completedroot'));
const mkdirp = require('mkdirp-promise');

const checkExists = async (key) => {
  await mkdirp(completedMarkersDir);
  const markerPath = path.join(completedMarkersDir, key);
  return fs.existsSync(markerPath);
};

module.exports = checkExists;
