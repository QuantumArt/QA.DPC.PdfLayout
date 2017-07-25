const path = require('path');
const winston = require('winston');
const config = require('config');

const logsPath = path.join(config.get('logs'), 'error-log.json');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'error',
      colorize: true,
      timestamp: true,
      humanReadableUnhandledException: true,
      prettyPrint: true,
    }),
    new (winston.transports.File)({
      level: 'error',
      filename: logsPath,
      maxsize: 1e+6,
      json: true,
      prettyPrint: true,
      stringify: true,
    }),
  ],
});

module.exports = logger;
