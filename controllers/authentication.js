var User =  require('../models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');


exports.signup = function(req, res) {
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
  bcrypt.genSalt(10, function(err, salt) { 
    if (err) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }

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
};


exports.login = function(req, res, next){
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
};
