const path = require('path');

module.exports = {
  engines: {
    pug: {
      path: path.resolve('views', 'pug'),
      ext: 'pug',
    },
    handlebars: {
      path: path.resolve('views', 'handlebars'),
      ext: 'hbs',
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
