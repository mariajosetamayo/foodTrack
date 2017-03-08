var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var bcrypt = require('bcryptjs');


module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  //Passport local strategy fetches user which matches username provided.
  passport.use(new LocalStrategy(
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
  ));
  
}
