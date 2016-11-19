$(document).ready(function(){
    console.log('this is doing something')
  getDatesOfMeals() 
})

///// Variables to obtain elements from the DOM /////

var diaryDatesTable = $('#diaryDates');

///// Methods to check for unique values //////

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

////// Requests //////

var getDatesOfMeals = function() {
    var ajax = $.ajax('/meals', {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(function(res){
        var mealDates = res.map(function(item){
            return item.date
        })
        var uniqueMealDates = mealDates.unique();
        appendDiaryDatesToTable(uniqueMealDates)
    });
};

////// Functions to display elements in DOM //////

var appendDiaryDatesToTable = function (dates){
    dates.sort();
    for(var i = 0; i<dates.length; i++){
        if(dates[i] !== null){
            diaryDatesTable.append( '<a href="/report" class="list-group-item">' + dates[i] + '</a>')
        }
    }
}

///// Pending code /////

// Attempt to format dates

// var datesFormat = dates[i].toLocaleDateString('en-US');