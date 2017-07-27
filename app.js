const argv = require('yargs')
  .option('url', {
    alias: 'u',
    describe: 'url to get data from',
  })
  .option('tariff', {
    alias: 't',
    describe: 'tariff to build',
  })
  .option('engine', {
    alias: 'e',
    describe: 'templating engine to use',
  })
  .option('pdf', {
    describe: 'specify if add pdf compilation',
    type: 'boolean',
  })
  .demandOption(['url', 'tariff', 'engine'], 'URL, tariff type and engine to use are required to start')
  .help()
  .argv;

// console.log(argv);

const compiler = require(`./controls/${argv.tariff}`);
compiler(argv.tariff, argv.url, argv.engine, argv.pdf);
