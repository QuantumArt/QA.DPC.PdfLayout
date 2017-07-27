const path = require('path');
const mkdirp = require('mkdirp');
const winston = require('winston');
const config = require('config');

const logsPath = config.get('logs');
mkdirp.sync(logsPath);

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      colorize: true,
      timestamp: true,
      humanReadableUnhandledException: true,
      prettyPrint: true,
    }),
    new (winston.transports.File)({
      level: 'warn',
      filename: path.join(logsPath, 'error-log.json'),
      maxsize: 1e+6,
      json: true,
      prettyPrint: true,
      stringify: true,
    }),
  ],
});

module.exports = logger;
