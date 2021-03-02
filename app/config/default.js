const path = require('path');
const defaultPort = 3000;

module.exports = {
  apiPort:  process.env.PORT || defaultPort,
  engines: {
    pug: {
      ext: 'pug',
    },
    handlebars: {
      ext: 'hbs',
    },
    dot: {
      ext: 'dot',
    },
    ejs: {
      ext: 'ejs',
    },
  },
};

