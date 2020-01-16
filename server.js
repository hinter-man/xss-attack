const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')
var exphbs = require('express-handlebars')

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
  // Uses multiple partials dirs, templates in "shared/templates/" are shared
  // with the client-side of the app (see below).
  partialsDir: [
    'shared/templates/',
    'views/partials/'
  ]
});


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

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  getAll(res, true);
});

app.post('/', (req, res) => {
  insert(res, 'Mani', req.body.tweet, '/');
});

app.post('/like', (req, res) => {
  incrementLike(res, req.body.id).then(
    getAll(res, true)
  )
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
      "INSERT INTO `twitter_db`.`Tweet` (`Username`, `CreationDate`, `Text`, `LikeCount`)" +
      " VALUES (?, ?, ?, 0)",
      [userName, new Date(), tweetText],
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

function getAll(res, includeLayout = true) {
  connectionPool.getConnection((err, connection) => {
    // fetch tweets from db
    connection.query(
      'SELECT * FROM twitter_db.Tweet',
      function (err, rows) {
        if (err) {
          res.status(404).send('something went wrong!');
          console.err(err);
        }

        if (includeLayout) {
          res.render('partials/items', {
            data: rows
          });
        } else {


          res.render('partials/items', {
            layout: false,
            data: rows
          });
        }
      });
    connection.release();
  });
}

function incrementLike(res, id) {

  return new Promise(function (resolve, reject) {
    connectionPool.getConnection((err, connection) => {
      connection.query(
        "UPDATE `twitter_db`.`Tweet` " +
        "SET LikeCount = LikeCount+1 " +
        "WHERE Id=?",
        [id],
        (err, rows) => {
          if (err) {
            reject(err);
          }

          resolve();
        }
      )
      connection.release();
    });
  });


}
