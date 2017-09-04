const path = require('path');

const workdirBase = path.resolve('c:/temp/QA.DPC.Node.PdfGenerator.workdir');
const lockfilesRoot = path.join(workdirBase, 'lockfiles');

module.exports = {
  mappersPath: path.join(workdirBase, 'mappers'),
  viewsPath: path.join(workdirBase, 'views'),
  tariffJsonPath: path.join(workdirBase, 'tariffs'),
  output: path.join(workdirBase, 'output'),
  logs: path.resolve('c:/logs/QA.DPC.Node.PdfGenerator'),
  locks: {
    root: path.join(workdirBase, 'lockfiles'),
    completedroot: path.join(lockfilesRoot, 'completed'),
    stale: 60000,
    retries: 100,
  },
  zipdownloadpath: path.join(workdirBase, 'zip'),
};
