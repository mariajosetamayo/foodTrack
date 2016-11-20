var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // By adding required, if you try to save an item without a name, it will throw an error
    date: { type: Date, required: true},
    meal: { type: String, required: true},
    nutrients: { type: Array, required: true},
    username: { type: String, required: true},
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;