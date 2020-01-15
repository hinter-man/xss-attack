const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')
var exphbs = require('express-handlebars');

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

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
  getAll(res);
});

app.post('/', (req, res) => {
  insert(res, 'Mani', req.body.tweet, '/');
});


app.use(express.static('public'));

app.listen(config.port, config.host, (error) => {
  if (error) {
    throw new Error('Internal Server Error');
  }
  console.log(`server running on port ${config.port}`);
});


function insert(res, userName, tweetText, redirectTo) {
  connectionPool.getConnection((err, connection) => {
    connection.query(
      "INSERT INTO `twitter_db`.`Tweet` (`Username`, `CreationDate`, `Text`)" +
      " VALUES (?, ?, ?)",
      [userName , new Date(), tweetText],
      (err, rows) => {
        if (err) {
          res.status(404).send(err);
        }
        res.redirect(redirectTo);
      }
    )
    connection.release();
  });
}

function getAll(res) {
  connectionPool.getConnection((err, connection) => {
    // fetch tweets from db
    connection.query(
      'SELECT * FROM twitter_db.Tweet',
      function (err, rows) {
        if (err) {
          res.status(404).send('something went wrong!');
          console.err(err);
        }
        // fill template engine with data
        res.render('body', {
          data: rows
        });
      });
    connection.release();
  });
}
