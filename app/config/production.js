const path = require('path');

const workdirBasePath = process.env.WORKDIR_PATH;
const logsPath = process.env.LOGS_PATH;
const outputPath = process.env.OUTPUT_PATH;
const workdirBase = path.resolve(workdirBasePath);
const lockfilesRoot = path.join(workdirBase, 'lockfiles');

module.exports = {
  mappersPath: path.join(workdirBase, 'mappers'),
  viewsPath: path.join(workdirBase, 'views'),
  tariffJsonPath: path.join(workdirBase, 'tariffs'),
  output: path.resolve(outputPath),
  logs: path.resolve(logsPath),
  locks: {
    root: path.join(workdirBase, 'lockfiles'),
    completedroot: path.join(lockfilesRoot, 'completed'),
    stale: 60000,
    retries: 100,
  },
  zipdownloadpath: path.join(workdirBase, 'zip'),
};
