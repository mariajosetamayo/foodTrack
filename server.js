var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config');
var router = require('./routes');
var strategy = require('./services/passport')(passport);
var app = express();
var session = require('express-session')
mongoose.Promise = global.Promise;

// Middleware setup
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
  secret: 'Maria Marcela Veronica Felicitas Emilia Ortiz Aveleyra Castillo Ortiz Mena',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2628000000 },
})
);

// Load routes and pass in our app
router(app);

var runServer = function(callback) {
  mongoose.connect(config.DATABASE_URL, function(err) {
    if (err && callback) {
      return callback(err);
    }
    app.listen(config.PORT, function() {
      if (callback) {
        callback();
      }
    });
  });
};

if (require.main === module) {
  runServer(function(err) {
    if (err) {
      console.error(err);
    }
  });
};

exports.app = app;
exports.runServer = runServer;
