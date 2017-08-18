const path = require('path');

module.exports = {
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
  mappersPath: path.resolve('workdir/mappers'),
  viewsPath: path.resolve('workdir/views'),
  tariffJsonPath: path.resolve('workdir/tariffs'),
  output: path.resolve('output'),
  logs: path.resolve('logs'),
  locks: {
    root: path.resolve('workdir/lockfiles'),
    completedroot: path.join(path.resolve('workdir/lockfiles'), 'completed'),
    stale: 60000,
    retries: 100,
  },
  zipdownloadpath: path.resolve('workdir/zip'),
};

/*

http://apidpc.mts.dev.qsupport.ru/api/1.0/products/Tariff?Regions.Alias=msk&MarketingProduct.Alias=smart_bezlimitishhe&fields=*

*/
