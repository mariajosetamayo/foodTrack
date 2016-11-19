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
  var recommendationDiv = $('#recommendationDiv');
  var foodPhoto = $('#foodPhoto');
  var foodInfoDiv = $('.foodInfo');
  var foodInfoTitle = $('#foodInfoTitle');
  var nutritionTableTitle = $('.performance-facts__title');
  var caloriesFieldTable = $('#calories');
  var totalFatFieldTable = $('#total_fat');
  var saturatedFatFieldTable = $('#saturated_fat');
  var cholesterolFieldTable = $('#cholesterol');
  var sodiumFieldTable = $('#sodium');
  var carbohydratesFieldTable = $('#total_carbs');
  var fiberFieldTable = $('#dietary_fiber');
  var sugarFieldTable = $('#sugar');
  var proteinFieldTable = $('#protein');
  
  
  
  var state = {
    mealId: ''
  };
  
  foodInfoDiv.hide();
  
  /////// Requests ////////
  
  var onSaveMeal = function (name, date, meal, data){
    // name = foodName.val();
    // date = datePicker.val();
    // meal = mealType.val();
    console.log("this is the food name", name)
    console.log('this is the date', date)
    console.log('this is the meal', meal)
    console.log('this is the data', data)
    var newMeal = {'name': name, 'date': date, 'meal': meal, 'nutrients': data};
    console.log('this is the new meal', newMeal)
    var ajax = $.ajax('/meals', {
        type: 'POST',
        data: JSON.stringify(newMeal),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res){
      console.log('this is the saved meal', res)
      state.mealId = res._id;
      console.log('this is the id', state.mealId)
    });
  };
  
  
  /////// Requests to Nutritionix ////////
  
  function getFoodRequest(searchTerm){

		var searchTerm= searchTerm;
		var data = {
 			"query": searchTerm,
  			"timezone": "US/Eastern",
		};

		$.ajax({
  			url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
  			type: 'POST',
  			data: JSON.stringify(data),
  			headers: {
    			"Content-Type" : "application/json",
    			"x-app-id": "c7faf842",  
    			"x-app-key": "bc4a198b34d738f0f52d5f874775d99d",  
  			},
  			dataType: 'json',
  			success: function (data) {
    			// Este console.log te muestra el objeto que retornas
    			console.info(data);
    
    			//Mostrar elemento en pantalla
    			console.log(data.foods)
    			onSaveMeal(state.name, state.date, state.meal, data.foods)
    			showNutritionalValue(data);
    			var isRecommended = isFoodRecommended(data);
				  showRecomendation(isRecommended);
  			},
  			error: function (request, status, error) {
    			// Estos console.log te dan informacion del error.
    			console.log(request.responseText);
    			console.log(error);
    			console.log(status);
    		// 	var errorElem = showError(error);
  			},
		});
	}
	
	////// Functions to filter data from Nutritionix //////
	
	function isFoodRecommended(data){
		var isRecommended = true;
		for (var i=0; i< data.foods[0].full_nutrients.length; i++){
			var nutrient = data.foods[0].full_nutrients[i];
			var nutrientID = nutrient.attr_id;
			// console.log(nutrientID); te imprime toodos los ides de los full_nutrients, un opor uno.
			if(nutrientID === 305){
			 	var phosphorus = nutrient.value;
			}
			if(nutrientID === 605){
			 	var transFat = nutrient.value;
			}
		}

		if ((data.foods[0].nf_total_carbohydrate>=60) || (data.foods[0].nf_calories> 200) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30) || (data.foods[0].nf_saturated_fat>3) || (transFat>0) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30) || (data.foods[0].nf_potassium>=200) || (phosphorus>= 150) || (data.foods[0].nf_sodium>=200)){
			isRecommended = false;
		};
		return isRecommended;
	};
	
	////// Functions to display data on DOM //////
	
	function showNutritionalValue(data){
		foodPhoto.attr('src', data.foods[0].photo.thumb);
		foodInfoTitle.text('Information for:' + ' ' + data.foods[0].food_name);
		// Nutritional table information fields
		nutritionTableTitle.text("Nutrition Information"+ data.foods[0].serving_weight_grams + " grams");
		caloriesFieldTable.text(data.foods[0].nf_calories + " Kcal");
		totalFatFieldTable.text(data.foods[0].nf_total_fat + " g");
		saturatedFatFieldTable.text(data.foods[0].nf_saturated_fat + " g");
		cholesterolFieldTable.text(data.foods[0].nf_cholesterol + "mg");
		sodiumFieldTable.text(data.foods[0].nf_sodium + " mg");
		carbohydratesFieldTable.text(data.foods[0].nf_total_carbohydrate + " g");
		fiberFieldTable.text(data.foods[0].nf_dietary_fiber + " g");
		sugarFieldTable.text(data.foods[0].nf_sugars + " g");
		proteinFieldTable.text(data.foods[0].nf_protein + " g");
	}

	function showRecomendation(isRecommended){
		recommendationDiv.empty()
		if (isRecommended){
			recommendationDiv.append("<h2> Recommended!!!</h2><br/><p>If you have kidney diseases, this food is a good choice because it is low in: carbohydrates, protein, potassium, phosphorus,sugar, and sodium. </p>");
		} else{
			recommendationDiv.append("<h2> Not Recommended!!! </h2><br/><p>If you have kidney diseases, this food is not a good choice because it is high in: carbohydrates, protein, potassium, phosphorus,sugar, and sodium. </p>");
		}
	};
  
  /////// Events Listeners ///////
  
  saveMealButton.click(function(event){
    event.preventDefault();
    state.name = foodName.val();
    state.date = datePicker.val();
    state.meal = mealType.val();
    getFoodRequest(state.name)
    foodInfoDiv.show();
    foodName.val('');
    datePicker.val('');
    mealType.val('');
  })
});