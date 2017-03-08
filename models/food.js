var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true},
    meal: { type: String, required: true},
    nutrients: { type: Array, required: false},
    username: { type: String, required: true},
});

module.exports = mongoose.model('Item', ItemSchema);
