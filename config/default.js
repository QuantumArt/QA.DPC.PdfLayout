const path = require('path');

module.exports = {
  engines: {
    pug: {
      path: path.resolve('views', 'pug'),
      ext: 'pug',
    },
    handlebars: {
      path: path.resolve('views', 'handlebars'),
      ext: 'js',
    },
  },
  output: path.resolve('output'),
  logs: path.resolve('logs'),
};

/*

http://apidpc.mts.dev.qsupport.ru/api/1.0/products/Tariff?Regions.Alias=msk&MarketingProduct.Alias=smart_bezlimitishhe&fields=*

*/
