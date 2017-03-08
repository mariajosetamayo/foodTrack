var Item = require('../models/food');

// Server-side render endpoints for all the application's views

exports.home =  function(req, res) {
  res.render('pages/index', { username:null });
};

exports.userHome = function (req, res){
  res.render('pages/user-home', { username:req.user.username });
};

exports.addFood = function (req, res){
  res.render('pages/add-food', { item:{}, username:req.user.username });
};

exports.editFood = function (req, res){
  var queryID = {_id: req.params.id}
  Item.findOne(queryID,
  function(err, item){
    if(err) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    item.simpleDate = item.date.getFullYear() + '/' + (item.date.getMonth() + 1) + '/' + item.date.getDate();
    res.render('pages/add-food', {item:item, username:req.user.username });
  });
};

exports.signUp = function (req, res){
  res.render('pages/signup', { username:null });
};

exports.report = function (req, res) {
  res.render('pages/report', { username:{} });
};

exports.reportDate = function(req, res){
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
};
