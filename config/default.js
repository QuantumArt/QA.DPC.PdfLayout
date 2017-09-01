const path = require('path');

const workdirBase = path.resolve('workdir');
const lockfilesRoot = path.join(workdirBase, 'lockfiles');

module.exports = {
  apiPort: 3000,
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
  mappersPath: path.join(workdirBase, 'mappers'),
  viewsPath: path.join(workdirBase, 'views'),
  tariffJsonPath: path.join(workdirBase, 'tariffs'),
  output: path.resolve('output'),
  logs: path.resolve('c:/logs/QA.DPC.Node.PdfGenerator'),
  locks: {
    root: lockfilesRoot,
    completedroot: path.join(lockfilesRoot, 'completed'),
    stale: 60000,
    retries: 100,
  },
  zipdownloadpath: path.join(workdirBase, 'zip'),
};

/*

http://apidpc.mts.dev.qsupport.ru/api/1.0/products/Tariff?Regions.Alias=msk&MarketingProduct.Alias=smart_bezlimitishhe&fields=*

*/
