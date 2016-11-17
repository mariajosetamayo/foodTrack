var mongoose = require('mongoose');

///// User schemas ///////

var UserSchema = mongoose.Schema({
    // name : {type : String, required : true},
    // lastName : {type : String, required : true},
    username : {type : String, required : true, unique: true},
    password : {type : String, required : true}
});

// User variable declared according to schema

var User = mongoose.model('User', UserSchema);

///// Exports /////

module.exports = User;