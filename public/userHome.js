
////// Variables to obtain elements from the DOM /////

var tableOfdiaryEntriesByDate = $('#diaryDates');

////// Methods to check for unique values of dates //////

Array.prototype.contains = function(v) {
  for(var i = 0; i < this.length; i++) {
    if(this[i] === v) return true;
  };
  return false;
};

Array.prototype.unique = function() {
  var arr = [];
  for(var i = 0; i < this.length; i++) {
    if(!arr.contains(this[i])) {
      arr.push(this[i]);
    }
  };
  return arr;
};

////// Requests to server.js //////

var getDatesOfMeals = function() {
  var ajax = $.ajax('/meals', {
    type: 'GET',
    dataType: 'json'
  });
  ajax.done(function(res){
    var mealDates = res.map(function(item){
      return item.date
    });
    var uniqueMealDates = mealDates.unique();
    appendDiaryDatesToTable(uniqueMealDates);
  });
};

var saveSelectedDate = function(data){
  var chosenMealToView = {meals: data};
  var ajax = $.ajax('/reports', {
    type: 'POST',
    data: JSON.stringify(chosenMealToView),
    dataType: 'json',
    contentType: 'application/json'
  });
};

////// Functions to display elements in DOM //////

var appendDiaryDatesToTable = function (dates){
  dates.sort();
  for(var i = 0; i<dates.length; i++){
    if(dates[i] !== null){
      var datesFormat = dates[i].split('T')[0];
      tableOfdiaryEntriesByDate.append( '<a href="/report/'+ datesFormat +'" class="list-group-item" id= '+ dates[i] +'>' + datesFormat + '</a>');
    }
  };
};

///// Event Listeners //////

$(document).ready(function(){
  getDatesOfMeals();
});
