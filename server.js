const express = require('express');
const bodyParser = require('body-parser');

const config = {
  name: 'xss-web-application',
  port: 3000
};

const app = express();

app.use(express.static('public'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Hell Mandi');
});


app.listen(config.port, config.host, (error) => {
  if (error) {
    throw new Error('Internal Server Error');
  }
  console.log(`server running on port ${config.port}`);
});

