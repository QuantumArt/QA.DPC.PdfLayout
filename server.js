const main = require('./main');
const process = require('process');
// const Stopwatch = require('node-stopwatch').Stopwatch;

const options = {
  tariffData: {
    id: 1231,
    timestamp: 1502106030,
    downloadUrl: 'http://localhost/tariff.json',
  },
  templateData: {
    id: 10101,
    timestamp: 1502105939, // unix timestamp
    downloadUrl: 'http://localhost/tariff_test.zip', 
  },
  mapperData: {
    id: 14881,
    timestamp: 1502105982,
    downloadUrl: 'http://localhost/mapper.js',
  },
  templateEngine: 'pug',
};

const options2 = {
  tariffData: {
    id: 123554,
    timestamp: 150210,
    downloadUrl: 'http://localhost/tariff.json',
  },
  templateData: {
    id: 101045,
    timestamp: 1502101, // unix timestamp
    downloadUrl: 'http://localhost/tariff_test.zip', 
  },
  mapperData: {
    id: 148834,
    timestamp: 150210,
    downloadUrl: 'http://localhost/mapper.js',
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

// const path = require('path');
// const fs = require('fs');
// const fetch = require('node-fetch');
// const unzip = require('unzip');
// const downloader = require('./downloader');

// const options = {
//   lockKey: 'template_pug_1488_1502106030',
//   fileUrl: 'http://localhost/tariff_test.zip',
//   isZip: true,
//   isFolder: true,
//   destinationRootFolder: './views/pug/',
//   destinationName: 'template_pug_1488_1502106030',
// };

// downloader(options)
//   .then((res) => {
//     console.log(`finished: ${res}`);
//   });

// var url = 'http://localhost/tariff_test.zip';
// var destPath = path.join(path.resolve('output'), 'test.zip')
// var unzippedPath = path.join(path.resolve('output'), 'test_tariff');
// var isZip = true;
// var isFolder = true;

// fetch(url)
//     .then(res => {
//         const dest = fs.createWriteStream(destPath);
//         res.body.pipe(dest);

//     })
//     .then(res => {
//         if (isZip) {
//             fs.createReadStream(destPath)
//                 .pipe(unzip.Extract({
//                     path: unzippedPath
//                 }));
//             console.log('unzipped', res);
//         }

//     })
//     .then(res => {
//         if (isFolder) {
//             const completedFilePath = path.join(unzippedPath, '.completed');
//             fs.closeSync(fs.openSync(completedFilePath, 'w'));
//             console.log('wrote completed file');
//         }

//     })
//     .then(res => {
//         if (isZip) {
//             console.log('deleting');
//             fs.unlinkSync(destPath);
//         }

//     })
//     .catch(err => {
//         console.log('error', err);
//     })



// let dirPath = path.resolve('views');
// let p = path.join(dirPath, 'pug', 'tariff_test', 'index1.pug');
// let exists = fs.existsSync(p);
// console.log('exists', exists);