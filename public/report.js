/////// Variables to selecte elements from the DOM ////////

var mealsTableTitle = $('#mealsTableTitle');
var mealsTableBody = $('#mealsTableBody');

////// Requests ///////

var getDatesOfMeals = function() {
    var ajax = $.ajax('/getReport/' + window.location.href.split("/")[window.location.href.split("/").length - 1], {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(function(res){
        console.log(res)
        appendMealsToTable(res)
    });
};

var onDeleteItem = function(id) {
    var ajax = $.ajax('/meals/' + id, {
        type: 'DELETE',
        dataType: 'json'
    });
    ajax.done(this.getItems.bind(this));
};

////// Functions to display elements in DOM //////

var appendTitleToTable = function(){
    mealsTableTitle.text('Meals for the' + ' ' + window.location.href.split("/")[window.location.href.split("/").length - 1] )
}

var appendMealsToTable = function(meals){
    for(var i = 0; i<meals.length; i ++){
        console.log('this is the meals id', meals[i]._id)
       mealsTableBody.append('<tr id = '+ meals[i]._id +'><th scope="row">' + meals[i].name + '</th>' + '<td>' + meals[i].meal + '<td><a>Edit</a></td><td><a class = "remove">Remove</a></td></tr>') 
    }
}

var removeMealEntry = function(meal){
   var $mealId = $('#meal')
   $mealId.remove()
}

////// Event Listeners ///////

mealsTableBody.on('click','.remove', function(event){
    event.preventDefault();
    var mealClickedToRemove = $(this).closest('tr').attr('id');
    console.log('this is the variable to be removed', mealClickedToRemove)
    removeMealEntry(mealClickedToRemove)
})

$(document).ready(function(){
    getDatesOfMeals()
    appendTitleToTable()
})