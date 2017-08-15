const main = require('./main');
const process = require('process');

const options = {
  tariffData: {
    id: 1231,
    timestamp: 1502106030,
    downloadUrl: 'http://localhost:8082/tariff.json',
  },
  templateData: {
    id: 10101,
    timestamp: 1502105939, // unix timestamp
    downloadUrl: 'http://localhost:8082/tariff_test.zip',
  },
  mapperData: {
    id: 14881,
    timestamp: 1502105982,
    downloadUrl: 'http://localhost:8082/mapper.js',
  },
  templateEngine: 'pug',
};

const options2 = {
  tariffData: {
    id: 123554,
    timestamp: 150210,
    downloadUrl: 'http://localhost:8082/tariff.json',
  },
  templateData: {
    id: 101045,
    timestamp: 1502101, // unix timestamp
    downloadUrl: 'http://localhost:8082/tariff_test.zip',
  },
  mapperData: {
    id: 148834,
    timestamp: 150210,
    downloadUrl: 'http://localhost:8082/mapper.js',
  },
  templateEngine: 'pug',
};

(async () => {
  await main(options);
  const dateStart = process.hrtime();
  await main(options2);
  const diff = process.hrtime(dateStart);
  console.log(`${diff}`);
  console.log('finished all');
})();
