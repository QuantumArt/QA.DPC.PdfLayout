const downloader = require('./downloader');
const path = require('path');
const config = require('config');
const compiler = require('./compiler').compile;
const productMapper = require('./compiler').mapProduct;
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

const getTariffDataOptions = (options) => {
  const tariffKey = `tariff_${options.tariffData.id}_${options.tariffData.timestamp}_${options.tariffData.siteMode || 'live'}`;
  const result = {
    lockKey: tariffKey,
    fileUrl: options.tariffData.downloadUrl,
    isZip: false,
    isFolder: false,
    destinationRootFolder: config.get('tariffJsonPath'),
    destinationName: `${tariffKey}.json`,
  };

  console.log(`tariffOptions: ${stringToObj(result)}`);
  return result;
};

const getMapperDataOptions = (options) => {
  const mapperKey = `mapper_${options.mapperData.id}_${options.mapperData.timestamp}_${options.mapperData.siteMode || 'live'}`;
  const mapperDataOptions = {
    lockKey: mapperKey,
    fileUrl: options.mapperData.downloadUrl,
    isZip: false,
    isFolder: false,
    destinationRootFolder: path.join(config.get('mappersPath'), mapperKey),
    destinationName: 'index.js',
  };

  console.log(`mapperOptions: ${stringToObj(mapperDataOptions)}`);
  return mapperDataOptions;
};

const getTemplateDataOptions = (options) => {
  const templateKey = `template_${options.templateData.id}_${options.templateData.timestamp}_${options.templateData.siteMode || 'live'}`;
  const templateDataOptions = {
    lockKey: templateKey,
    fileUrl: options.templateData.downloadUrl,
    isZip: true,
    isFolder: true,
    destinationRootFolder: path.join(
      config.get('viewsPath'),
      options.templateEngine,
    ),
    destinationName: templateKey,
  };

  console.log(`templateOptions: ${stringToObj(templateDataOptions)}`);
  return templateDataOptions;
};

const generateHtml = async (options) => {
  // var options = {
  //     lockKey : 'template_pug_1488_1502106030',
  //     downloadUrl: 'http://blabla/template_1488',
  //     isZip : true,
  //     isFolder: true,
  //     destinationRootFolder: '/views/pug/',
  //     destinationName : 'template_pug_1488_1502106030'
  // };

  try {
    const tariffDataOptions = getTariffDataOptions(options);
    const mapperDataOptions = getMapperDataOptions(options);
    const templateDataOptions = getTemplateDataOptions(options);

    await Promise.all([
      downloader(tariffDataOptions),
      downloader(mapperDataOptions),
      downloader(templateDataOptions),
    ]);

    const outputName = `${options.tariffData.id}_${options.tariffData
      .timestamp}/${options.mapperData.id}_${options.mapperData
      .timestamp}/${options.templateData.id}_${options.templateData.timestamp}_${options.templateData.siteMode || 'live'}`;

    await compiler({
      tariffJsonPath: path.join(
        tariffDataOptions.destinationRootFolder,
        tariffDataOptions.destinationName,
      ),
      mapperPath: mapperDataOptions.destinationRootFolder,
      templatePath: path.join(
        templateDataOptions.destinationRootFolder,
        templateDataOptions.destinationName,
      ),
      outputDirName: outputName,
      engine: options.templateEngine,
    });

    return outputName;
  } catch (e) {
    console.log('error occured', e);
    throw e;
  }
};

const previewJson = async (options) => {
  const tariffDataOptions = getTariffDataOptions(options);
  const mapperDataOptions = getMapperDataOptions(options);

  await Promise.all([
    downloader(tariffDataOptions),
    downloader(mapperDataOptions),
  ]);

  const result = await productMapper({
    tariffJsonPath: path.join(
      tariffDataOptions.destinationRootFolder,
      tariffDataOptions.destinationName,
    ),
    mapperPath: mapperDataOptions.destinationRootFolder,
  });

  return result;
};

module.exports.generateHtml = generateHtml;
module.exports.previewJson = previewJson;
