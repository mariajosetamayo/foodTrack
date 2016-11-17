var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/users');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
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

////// Passport //////

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//Passport local strategy fetches user which matches username provided. 
// 
var strategy = new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            console.log("this is the user", user)
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

// var app = express();
var jsonParser = bodyParser.json();

passport.use(strategy);



// Endpoint para home -> que haga render de home
app.get('/',function(req,res){
  res.sendFile('index.html');
});
// Endpoint para signup -> que haga render de pag de sign up
app.get('/signup',function(req,res){
  res.sendFile(__dirname + '/public/signup.html');
  console.log(__dirname)
});
// Endpoint para user home -> que haga render de pag de sign up
app.get('/user-home',function(req,res){
  res.sendFile(__dirname + '/public/user-home.html');
  console.log(__dirname)
});
// Endpoint para add food -> que haga render de pag de sign up
app.get('/addFood',function(req,res){
  res.sendFile(__dirname + '/public/addFood.html');
  console.log(__dirname)
});
// Endpoint para report -> que haga render de pag de sign up
app.get('/report',function(req,res){
  res.sendFile(__dirname + '/public/report.html');
  console.log(__dirname)
});




// Endpoint which is protected by strategy so it requires a valid username and password
// app.get('/signin', passport.authenticate('basic', {session: false}), function(req, res) {
//     res.json({
//         message: 'Luke... I am your father'
//     });
// });

// Endpoint for login
app.post('/login', function(req, res, next){
    console.log("this is the request", req.body)
    passport.authenticate('local', function(err, user, info) {
        console.log("this is the user", user)
        // user = req.body
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.send({error : 'something went wrong :('}); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            return res.send({success:'success'});
        });
    }) (req, res, next);
})


// Endpoint for creating users  TODO: cambiar a sign up. 
app.post('/signup', jsonParser, function(req, res) {
    console.log("we are hitting the users endpoint and the request receiced is", req.body)
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
            
            console.log(salt)
        }

        console.log("we are getting just before the hash part! username and password are ", username, password)

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                console.log("there was an error hashing!")
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            
            console.log("we are about to create the user!")

            var user = new User({
                username: username,
                password: hash
            });
            
            console.log("user created and is: ", user)

            user.save(function(err, user) {
                if (err) {
                    console.log("error saving the user!!! ", err)
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }
                console.log("AW YISS!!!")
                return res.status(201).json(user);
            });
        });
    });
});

exports.app = app;
exports.runServer = runServer;
