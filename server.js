const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')

const config = {
  name: 'xss-web-application',
  port: 3000
};

const connectionPool = mysql.createPool({
  host: 'twitterdb',
  user: 'root',
  password: 'root',
  database: 'twitter_db'
});

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  connectionPool.getConnection((err, connection) => {

  // fetch tweets from db
  connection.query(
      'SELECT * FROM twitter_db.Tweet',
      function (err, rows) {
        if (err) console.error(err);

        // apply template
      });
    connection.release();
  });

  res.sendFile(__dirname + '/public/twitter.html');
});

app.use(express.static('public'));

app.listen(config.port, config.host, (error) => {
  if (error) {
    throw new Error('Internal Server Error');
  }
  console.log(`server running on port ${config.port}`);
});

