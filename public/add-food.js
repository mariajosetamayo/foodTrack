$(document).ready(function () {
  
  //// jQuery UI for date picker ///////
  var date_input=$('input[name="date"]'); //our date input has the name "date"
  var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
  var options={
    format: 'mm/dd/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
  };
  date_input.datepicker(options);
  
  ///// Variables to obtain elements from the DOM ///////
  
  var foodName = $('#foodInput');
  var datePicker = $('#date');
  var mealType = $('#mealType');
  var saveMealButton = $('#saveBtn');
  
  var onSaveMeal = function (name, date, meal){
    name = foodName.val();
    date = datePicker.val();
    meal = mealType.val();
    console.log("this is the food name", name)
    console.log('this is the date', date)
    console.log('this is the meal', meal)
    var newMeal = {'name': name, 'date': date, 'meal': meal};
    console.log('this is the new meal', newMeal)
    var ajax = $.ajax('/meals', {
        type: 'POST',
        data: JSON.stringify(newMeal),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res){
      console.log("this is the response", res)
    });
  };
  
  /////// Events Listeners ///////
  
  saveMealButton.click(function(event){
    event.preventDefault();
    onSaveMeal();
    foodName.val('');
    datePicker.val('');
    mealType.val('');
  })
  
  

});