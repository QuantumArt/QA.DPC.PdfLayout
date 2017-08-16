const path = require('path');
const config = require('config');
const argv = require('yargs')
  .option('basePath', {
    alias: 'b',
    describe: 'base path to resources',
  })
  .option('tariffJsonPath', {
    alias: 'd',
    describe: 'tariff data path',
  })
  .option('mapperPath', {
    alias: 'm',
    describe: 'mapper to use',
  })
  .option('templatePath', {
    alias: 't',
    describe: 'template to use',
  })
  .option('engine', {
    alias: 'e',
    describe: 'templating engine to use',
  })
  .option('pdf', {
    describe: 'specify if add pdf compilation',
    type: 'boolean',
  })
  .demandOption(['basePath', 'tariffJsonPath', 'mapperPath', 'templatePath', 'engine'], 'Base path, JSON, tariff, template and engine to use are required to start')
  .help()
  .argv;
const logger = require('./logger');
const compiler = require('./compiler');
// console.log(argv);

try {
  const {
    basePath,
    tariffJsonPath,
    mapperPath,
    templatePath,
    engine,
  } = argv;

  (async () => {
    await compiler({
      tariffJsonPath: path.resolve(basePath, tariffJsonPath),
      mapperPath: path.resolve(basePath, mapperPath),
      templatePath: path.resolve(basePath, templatePath),
      engine,
      // outputDirName: `render-${Date.now()}`,
      outputDirName: 'test-render',
    });
  })();
} catch (error) {
  logger.error('Error from cli.js', error);
}
