const path = require('path');
const config = require('config');
const argv = require('yargs')
  .option('basePath', {
    alias: 'b',
    describe: 'base path to resources',
  })
  .option('jsonPath', {
    alias: 'd',
    describe: 'data path',
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
  .demandOption(['basePath', 'jsonPath', 'mapperPath', 'templatePath', 'engine'], 'Base path, JSON, tariff, template and engine to use are required to start')
  .help()
  .argv;
const logger = require('./logger');
const compiler = require('./compiler').compile;
// console.log(argv);

console.log(`NODE_ENV: ${config.util.getEnv('NODE_ENV')}`);

try {
  const {
    basePath,
    jsonPath,
    mapperPath,
    templatePath,
    engine,
  } = argv;
  const json = path.parse(jsonPath);

  (async () => {
    await compiler({
      tariffJsonPath: path.resolve(basePath, jsonPath),
      mapperPath: path.resolve(basePath, mapperPath),
      templatePath: path.resolve(basePath, templatePath),
      engine,
      outputDirName: `${json.name}-${engine}`,
    });
  })();
} catch (error) {
  logger.error('Error from cli.js', error);
}
