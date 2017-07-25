const path = require('path');

module.exports = {
  views: {
    pug: path.resolve('views', 'pug'),
    handlebars: path.resolve('views', 'handlebars'),
  },
  output: path.resolve('output'),
  logs: path.resolve('logs'),
};
