var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var config = require('./config');

var app = express();
var session = require('express-session')

// set the view engine to ejs

app.set('view engine', 'ejs');

mongoose.Promise = global.Promise;

// Middleware setup

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/scripts'));
app.use(express.static(__dirname + '/public/styles'));
app.use(express.static(__dirname + '/public'));

//app.use(app.sessionMiddleware);

app.use(session({
  secret: 'Maria Marcela Veronica Felicitas Emilia Ortiz Aveleyra Castillo Ortiz Mena',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2628000000 },
})
);

///// Function for running the server //////

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

////// Passport strategy setup //////

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//Passport local strategy fetches user which matches username provided.

var strategy = new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, function(error, response){
        if (response === true){
          return done(null,user)
        }
        else {
          return done(null, false)
        }
      })
    });
  }
);

app.isAuthenticated = function(req, res, next){
  // If the current user is logged in
  if( req.isAuthenticated() ){
    // Middleware allows the execution chain to continue/Middleware
    return next();
  }
  // If not, redirect to login
  res.redirect('/');
};

// var app = express();
var jsonParser = bodyParser.json();

passport.use(strategy);

////// Endpoints //////

//// Rendering Endpoints //////

// Endpoint for home
// index page
app.get('/', function(req, res) {
  res.render('pages/index', { username:null });
});
// Endpoint for rendering user-home
app.get('/user-home', app.isAuthenticated, function (req, res){
  res.render('pages/user-home', { username:req.user.username });
});
// Endpoint for rendering addfood page
app.get('/addFood', app.isAuthenticated, function (req, res){
  res.render('pages/add-food', { item:{}, username:req.user.username });
});
// Endpoint for rendering editFood page
app.get('/addFood/:id', app.isAuthenticated, function (req, res){
var queryID = {_id: req.params.id}
Item.findOne(queryID,
function(err, item){
  if(err) {
    return res.status(500).json({
      message: 'Internal Server Error'});
    }
    item.simpleDate = item.date.getFullYear() + '/' + (item.date.getMonth() + 1) + '/' + item.date.getDate();
    res.render('pages/add-food', {item:item, username:req.user.username });
  });
});
// Endpoint for redenring signup
app.get('/signup', function (req, res){
  res.render('pages/signup', { username:null });
});
// Endpoint for getting report
app.get('/report/:date', app.isAuthenticated, function (req, res) { // we include the date in the endpoint so we can go another get request when the page loads
  res.render('pages/report', { username:{} });
});
app.get('/getReport/:date', app.isAuthenticated, function(req, res){
  var oneDayAfter = new Date(req.params.date); // set format for date
  oneDayAfter.setDate(oneDayAfter.getDate() + 1); // assign variable the value of the day after the date request
  Item.find({username: req.user.username, date : {$gte : new Date(req.params.date), $lt : new Date(oneDayAfter)}}, function(err, foundMeals){ // here we query the db to find the entries that match the present day.
    // We know it is the present day because it has to be between 12am of request day and 12am on the next day
    if (err) {
      res.send(err)
    } else {
      res.send(foundMeals) // these are the meals found which match the request date
    }
  });
});

////// Passport endpoints /////

// Endpoint for login
app.post('/login', function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({message : 'something went wrong :('});
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({message:'success'});
    });
  }) (req, res, next);
});


// Endpoint for creating users
app.post('/signup', jsonParser, function(req, res) {
  //console.log("we are hitting the users endpoint and the request received is", req.body)
  if (!req.body) {
    return res.status(400).json({
      message: "No request body"
    });
  }

  if (!('username' in req.body)) {
    return res.status(422).json({
      message: 'Missing field: username'
    });
  }

  var username = req.body.username;

  if (typeof username !== 'string') {
    return res.status(422).json({
      message: 'Incorrect field type: username'
    });
  }

  username = username.trim();

  if (username === '') {
    return res.status(422).json({
      message: 'Incorrect field length: username'
    });
  }

  if (!('password' in req.body)) {
    return res.status(422).json({
      message: 'Missing field: password'
    });
  }

  var password = req.body.password;

  if (typeof password !== 'string') {
    return res.status(422).json({
      message: 'Incorrect field type: password'
    });
  }
  password = password.trim();

  // Password hashing
  bcrypt.genSalt(10, function(err, salt) { // takes number 10 to indicate how many rounds of salting algorythm should be used
    if (err) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }

    //console.log("we are getting just before the hash part! username and password are ", username, password)

    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error'
        });
      }

      var user = new User({
        username: username,
        password: hash
      });

      user.save(function(err, user) {

        if (err) {
          return res.status(500).json({
            message: 'Internal server error'
          });
        }

        return res.status(201).json(user);
      });
    });
  });
});

// logs present user out
app.get("/logout", function (req,res) {
  //console.log('this is also doing something on logout in the server')
  req.logOut();
  res.redirect('/');
});

////// Endpoints for adding food ///////

var Item = require('./models/food');

// endpoint to get the meals
app.get('/meals', app.isAuthenticated, function(req, res) {
  Item.find({ username: req.user.username }, function(err, items) { //fetches a list of all the items from the DB using find. Returns json
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.status(200).json(items);
  });
});

// enpoint to post a new meal
app.post('/meals', app.isAuthenticated, function(req, res) {
  Item.create({name: req.body.name, date: new Date(req.body.date), meal: req.body.meal, nutrients: req.body.nutrients, username: req.user.username },
  function(err, items) {
    if (err) {
      console.log(err)
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.status(201).json(items);
  });
});

// enpoint to change a meal
app.put('/meals/:id', app.isAuthenticated, function(req, res){
  var queryID = {_id: req.params.id}
  var updateItem = {name: req.body.name, _id: req.params.id, date: req.body.date, meal: req.body.meal, nutrients: req.body.nutrients}
  Item.findOneAndUpdate(queryID, updateItem, function(err, items){
    if(err) {
      return res.status(500).json({
        message: 'Internal Server Error'}
      );
    }
    res.status(201).json(updateItem)
  });
});

// enpoint to delete a meal
app.delete('/meals/:id', app.isAuthenticated, function(req, res){
  var chosenItemID = {_id: req.params.id}
  Item.findOneAndRemove({_id: req.params.id},
    function(err, item){
      if(err){
        return res.status(500).json({
          message: 'Internal Server Error'
        });
      }
      res.status(201).json(chosenItemID)
    });
  });

// endpoint for selected date
app.post('/reports', app.isAuthenticated, function(req, res){
  var chosenMealToView = {meals: req.body}
  res.json(chosenMealToView);
});

exports.app = app;
exports.runServer = runServer;
