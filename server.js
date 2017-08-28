const express = require('express');
const bodyParser = require('body-parser');
const main = require('./main');
const config = require('config');

const app = express();

const jsonParser = bodyParser.json();

app.post('/generate', jsonParser, async (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  res.setHeader('Content-Type', 'application/json');
  const options = req.body;
  try {
    const outputPath = await main(options);
    const resp = {
      success: true,
      relativePath: outputPath,
    };
    return res.send(JSON.stringify(resp));
  } catch (e) {
    const resp = {
      success: false,
      error: e,
    };
    return res.status(500).send(JSON.stringify(resp));
  }
});

app.use('/output', express.static('output'));
app.use('/testdata', express.static('tests/testdata'));

const apiPort = config.get('apiPort');
app.listen(apiPort, () => {
  console.log(`listening on port ${apiPort}`);
});
