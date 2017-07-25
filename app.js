const argv = require('minimist')(process.argv.slice(2));
const getData = require('./controls');


console.log(argv);

// getData('http://apidpc.mts.dev.qsupport.ru/api/1.0/products/Tariff?Regions.Alias=msk&MarketingProduct.Alias=smart_bezlimitishhe&fields=*');
