const path = require('path');

const defaultWorkPath = 'c:/temp/QA.DPC.Node.PdfGenerator.workdir';
const defaultLogsPath = 'c:/Logs/QA.DPC.Node.PdfGenerator';
const defaultOutputPath = 'output';
const workdirBasePath = process.env.WORKDIR_PATH || defaultWorkPath;
const logsPath = process.env.LOGS_PATH || defaultLogsPath;
const outputPath = process.env.OUTPUT_PATH || defaultOutputPath;
const workdirBase = path.resolve(workdirBasePath);
const lockfilesRoot = path.join(workdirBase, 'lockfiles');

module.exports = {
  apiPort: 80,
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
