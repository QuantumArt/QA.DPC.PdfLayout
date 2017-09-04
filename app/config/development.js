const path = require('path');

const workdirBase = path.resolve('workdir');
const lockfilesRoot = path.join(workdirBase, 'lockfiles');

module.exports = {
  mappersPath: path.join(workdirBase, 'mappers'),
  viewsPath: path.join(workdirBase, 'views'),
  tariffJsonPath: path.join(workdirBase, 'tariffs'),
  output: path.resolve('output'),
  logs: path.resolve('logs'),
  locks: {
    root: path.join(workdirBase, 'lockfiles'),
    completedroot: path.join(lockfilesRoot, 'completed'),
    stale: 60000,
    retries: 100,
  },
  zipdownloadpath: path.join(workdirBase, 'zip'),
};
