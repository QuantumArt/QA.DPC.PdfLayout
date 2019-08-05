const express = require('express');
const bodyParser = require('body-parser');
const htmlGenerator = require('./main').generateHtml;
const productMapper = require('./main').previewJson;
const config = require('config');

const app = express();

const jsonParser = bodyParser.json();

app.get('/', (req, res) => { res.send('Ready for reqests'); });

app.get('/ready', (req, res) => { res.send('Ready for reqests'); });

app.post('/generate', jsonParser, async (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  res.setHeader('Content-Type', 'application/json');
  const options = req.body;
  try {
    const outputPath = await htmlGenerator(options);
    const resp = {
      success: true,
      relativePath: outputPath,
    };
    return res.send(JSON.stringify(resp));
  } catch (e) {
    const resp = {
      success: false,
      error: e.stack,
    };
    return res.status(500).send(JSON.stringify(resp));
  }
});

app.post('/previewJson', jsonParser, async (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  res.setHeader('Content-Type', 'application/json');
  const options = req.body;
  try {
    const result = await productMapper(options);
    const resp = {
      success: true,
      jsonString: JSON.stringify(result),
    };
    return res.send(JSON.stringify(resp));
  } catch (e) {
    const resp = {
      success: false,
      error: e.stack,
    };
    return res.status(500).send(JSON.stringify(resp));
  }
});

app.use('/output', express.static('output'));
app.use('/testdata', express.static('test/fixtures'));

const apiPort = config.get('apiPort');
app.listen(apiPort, () => {
  console.log(`NODE_ENV: ${config.util.getEnv('NODE_ENV')}`);
  console.log(`listening on port ${apiPort}`);
});
