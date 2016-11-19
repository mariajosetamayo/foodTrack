$(document).ready(function(){
    console.log('this is doing something')
  getDatesOfMeals() 
})


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
        console.log(res)
        var mealDates = res.map(function(item){
            return item.date
        })
        var uniqueMealDates = mealDates.unique();
        console.log('this is the dates array', uniqueMealDates)
    });
};

////// Functions to display elements in DOM //////

