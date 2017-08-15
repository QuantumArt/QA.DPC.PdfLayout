const downloader = require('./downloader');
const path = require('path');
const config = require('config');
const compiler = require('./compiler');
const stringToObj = require('stringify-object');
// const options = {
//   tariffData: {
//     id: 123,
//     timestamp: 1502106030,
//     downloadUrl: 'http://blablabla/tariff',
//   },
//   templateData: {
//     id: 1010,
//     timestamp: 1502105939, // unix timestamp
//     downloadUrl: 'http://blablabla/template', 
//   },
//   mapperData: {
//     id: 1488,
//     timestamp: 1502105982,
//     downloadUrl: 'http://blablabla/mapper', 
//   },
//   templateEngine: 'pug',
// };

module.exports = async (options) => {
  // var options = {
//     lockKey : 'template_pug_1488_1502106030', 
//     downloadUrl: 'http://blabla/template_1488',
//     isZip : true,
//     isFolder: true,
//     destinationRootFolder: '/views/pug/',
//     destinationName : 'template_pug_1488_1502106030'
// };
  const tariffKey = `tariff_${options.tariffData.id}_${options.tariffData.timestamp}`;
  const tariffDataOptions = {
    lockKey: tariffKey,
    fileUrl: options.tariffData.downloadUrl,
    isZip: false,
    isFolder: false,
    destinationRootFolder: config.get('tariffJsonPath'),
    destinationName: `${tariffKey}.json`,
  };

  console.log(`tariffOptions: ${stringToObj(tariffDataOptions)}`);

  const mapperKey = `mapper_${options.mapperData.id}_${options.mapperData.timestamp}`;
  const mapperDataOptions = {
    lockKey: mapperKey,
    fileUrl: options.mapperData.downloadUrl,
    isZip: false,
    isFolder: false,
    destinationRootFolder: path.join(config.get('mappersPath'), mapperKey),
    destinationName: 'index.js',
  };

  console.log(`mapperOptions: ${stringToObj(mapperDataOptions)}`);

  // console.log('downloaded mapper');

  // await downloader(mapperDataOptions);

  const templateKey = `template_${options.templateData.id}_${options.templateData.timestamp}`;
  const templateDataOptions = {
    lockKey: templateKey,
    fileUrl: options.templateData.downloadUrl,
    isZip: true,
    isFolder: true,
    destinationRootFolder: path.join(config.get('viewsPath'), options.templateEngine),
    destinationName: templateKey,
  };

  console.log(`templateOptions: ${stringToObj(templateDataOptions)}`);
  // await downloader(templateDataOptions);

  await Promise.all([downloader(tariffDataOptions), downloader(mapperDataOptions), downloader(templateDataOptions)]);

  const result = await compiler({
    tariffJsonPath: path.join(tariffDataOptions.destinationRootFolder, tariffDataOptions.destinationName),
    mapperPath: mapperDataOptions.destinationRootFolder,
    templatePath: path.join(templateDataOptions.destinationRootFolder, templateDataOptions.destinationName),
    outputDirName: `${options.tariffData.id}_${options.tariffData.timestamp}/${options.mapperData.id}_${options.mapperData.timestamp}/${options.templateData.id}_${options.templateData.timestamp}`,
    engine: options.templateEngine,
  });
  return result;
};

// module.exports = function (callback, tariff, url, engine, pdf) {
//     try {
//         const compiler = require(`./controls/${tariff}`);
//         compiler(tariff, url, engine, pdf);
//         callback(null, 1);
//     } catch (error) {
//         logger.error('Error from App.js', error);
//     }
//     //callback(null,1);
// }
