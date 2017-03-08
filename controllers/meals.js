var Item = require('../models/food');

// Endpoints concerning user meals in food diary/application

exports.userMeals = function(req, res) {
  Item.find({ username: req.user.username }, function(err, items) {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.status(200).json(items);
  });
};

exports.newMeal = function(req, res) {
  Item.create(
    {
      name: req.body.name,
      date: new Date(req.body.date),
      meal: req.body.meal,
      nutrients: req.body.nutrients,
      username: req.user.username
    },
    function(err, items) {
      if (err) {
        return res.status(500).json({
          message: 'Internal Server Error'
        });
      }
      res.status(201).json(items);
    }
  );
};

exports.editMeal = function(req, res){
  var queryID = {_id: req.params.id}
  var updateItem = {
    name: req.body.name,
    _id: req.params.id,
    date: req.body.date,
    meal: req.body.meal,
    nutrients: req.body.nutrients
  }
  Item.findOneAndUpdate(queryID, updateItem, function(err, items){
    if(err) {
      return res.status(500).json({
        message: 'Internal Server Error'}
      );
    }
    res.status(201).json(updateItem)
  });
};

exports.deleteMeal = function(req, res){
  var chosenItemID = {_id: req.params.id};
  Item.findOneAndRemove(
    {_id: req.params.id},
    function(err, item){
      if(err){
        return res.status(500).json({
          message: 'Internal Server Error'
        });
      }
      res.status(201).json(chosenItemID);
    });
  };

  exports.report =  function(req, res){
    var chosenMealToView = {meals: req.body};
    res.json(chosenMealToView);
  };
