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
      filename: path.join(logsPath, 'errors.log'),
      maxsize: 1e+6,
      json: false,
    }),
  ],
});

module.exports = logger;
