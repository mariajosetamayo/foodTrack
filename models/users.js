var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


///// User schemas ///////

var UserSchema = mongoose.Schema({
    // name : {type : String, required : true},
    // lastName : {type : String, required : true},
    username : {type : String, required : true, unique: true},
    password : {type : String, required : true}
});

// User variable declared according to schema

var User = mongoose.model('User', UserSchema);

// UserSchema.methods.validatePassword = function(password, callback) { // bcrypt.compare method checks password against stored hash +salt
//     bcrypt.compare(password, this.password, function(err, isValid) {
//         if (err) {
//             callback(err);
//             return;
//         }
//         callback(null, isValid);
//     });
// };

///// Exports /////

module.exports = User;