var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


///// User schemas ///////

var UserSchema = mongoose.Schema({
    username : {type : String, required : true, unique: true},
    password : {type : String, required : true}
});

// User variable declared according to schema

var User = mongoose.model('User', UserSchema);


///// Exports /////

module.exports = User;