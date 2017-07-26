const fs = require('fs');
const util = require('util');
const postcss = require('postcss');
const url = require('postcss-url');

const readFile = util.promisify(fs.readFile);

const cssBase64 = async (sourcePath, outputPath) => {
  const css = await readFile(sourcePath, 'utf8');
  const output = postcss()
    .use(url({ url: 'inline' }))
    .process(css, {
      from: sourcePath,
      to: outputPath,
    });
};

module.exports = cssBase64;
