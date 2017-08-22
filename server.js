const express = require('express');
const bodyParser = require('body-parser');
const main = require('./main');

const app = express();

const jsonParser = bodyParser.json();

app.post('/generate', jsonParser, async (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const options = req.body;
  const outputPath = await main(options);
  return res.send(outputPath);
});

app.use('/output', express.static('output'));
app.use('/testdata', express.static('tests/testdata'));

app.listen(3000, () => {
  console.log('listening on port 3000');
});
