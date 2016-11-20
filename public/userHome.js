
///// Variables to obtain elements from the DOM /////

var diaryDatesTable = $('#diaryDates');
var welcomeUser = $('#welcomeUser');

///// State object for date variable /////
 var state = {
     selectedDate: ' ',
 }

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
        state.meals = res
    });
};


var selectedMealEntries = function (res){
    var findMealsInArray = res.filter(function(item){
        console.log('this is the date', state.selectedDate)
        return item.date == state.selectedDate
    });
    console.log('this is the returned meal', findMealsInArray)
    saveSelectedDate(findMealsInArray)
}


var saveSelectedDate = function(data){
    var chosenMealToView = {meals: data};
    var ajax = $.ajax('/report', {
        type: 'POST',
        data: JSON.stringify(chosenMealToView),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res){
        console.log('this is the response', res)
    });
}

////// Functions to display elements in DOM //////

var appendDiaryDatesToTable = function (dates){
    dates.sort();
    for(var i = 0; i<dates.length; i++){
        
        if(dates[i] !== null){
            var datesFormat = dates[i].split('T')[0];
            diaryDatesTable.append( '<a  class="list-group-item" id= '+ dates[i] +'>' + datesFormat + '</a>');
        }
    }
}

/////// Event listeners ///////

var diaryDate = diaryDatesTable.on('click', 'a', function(event){
    event.preventDefault();
    state.selectedDate = $(this).attr('id');
    selectedMealEntries(state.meals)
})

$(document).ready(function(){
  getDatesOfMeals()
})



////// PENDING CODE ///////

// var appendUserToWelcomeMessage = function (res){
//     welcomeUser.text('Welcome' + ' ' + res.name)
// }

//href="/report"