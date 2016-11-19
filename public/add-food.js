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
  
  var state = {
    mealId: ''
  };
  
  foodInfoDiv.hide();
  
  /////// Requests ////////
  
  var onSaveMeal = function (name, date, meal){
    name = foodName.val();
    date = datePicker.val();
    meal = mealType.val();
    console.log("this is the food name", name)
    console.log('this is the date', date)
    console.log('this is the meal', meal)
    var newMeal = {'name': name, 'date': date, 'meal': meal, 'nutrients': ''};
    console.log('this is the new meal', newMeal)
    var ajax = $.ajax('/meals', {
        type: 'POST',
        data: JSON.stringify(newMeal),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res){
      console.log('this is the saved meal', res)
      getFoodRequest(res.name);
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
	
	function showNutritionalValue(data){
		foodPhoto.attr('src', data.foods[0].photo.thumb);
		foodInfoTitle.text('Information for:' + ' ' + data.foods[0].food_name);

		// for (var i=0; i< data.foods[0].full_nutrients.length; i++){
		// 	var nutrient = data.foods[0].full_nutrients[i];
		// 	var nutrientID = nutrient.attr_id;
		// 	// console.log(nutrientID); te imprime toodos los ides de los full_nutrients, un opor uno.
		// 	if (window.nutrientField[nutrientID]) {
		// 		var name = window.nutrientField[nutrientID].name;
		// 		if (nutrient.value !== 0) {
		// 			micronutrientsDiv.append(
		// 				"<li>" + name + ": " + nutrient.value + " " + window.nutrientField[nutrientID].unit + "</li>"
		// 			);
		// 		}
		// 	}
		// }

		$(".performance-facts__title").text("Nutrition Information"+ data.foods[0].serving_weight_grams + " grams");
		$("#calories").text(data.foods[0].nf_calories + " Kcal");
		$("#total_fat").text(data.foods[0].nf_total_fat + " g");
		$("#saturated_fat").text(data.foods[0].nf_saturated_fat + " g");
		$("#cholesterol").text(data.foods[0].nf_cholesterol + "mg");
		$("#sodium").text(data.foods[0].nf_sodium + " mg");
		$("#total_carbs").text(data.foods[0].nf_total_carbohydrate + " g");
		$("#dietary_fiber").text(data.foods[0].nf_dietary_fiber + " g");
		$("#sugar").text(data.foods[0].nf_sugars + " g");
		$("#protein").text(data.foods[0].nf_protein + " g");
	
	}
	
	function isFoodRecommended(data){
		var isRecommended = true;
		for (var i=0; i< data.foods[0].full_nutrients.length; i++){
			var nutrient = data.foods[0].full_nutrients[i];
			var nutrientID = nutrient.attr_id;
			// console.log(nutrientID); te imprime toodos los ides de los full_nutrients, un opor uno.
			if(nutrientID === 305){
			 	var phosphorus = nutrient.value;
				console.log(phosphorus);
			}
			if(nutrientID === 605){
			 	var transFat = nutrient.value;
				console.log(phosphorus);
			}
		}

		if ((data.foods[0].nf_total_carbohydrate>=60) || (data.foods[0].nf_calories> 200) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30) || (data.foods[0].nf_saturated_fat>3) || (transFat>0) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30) || (data.foods[0].nf_potassium>=200) || (phosphorus>= 150) || (data.foods[0].nf_sodium>=200)){
			isRecommended = false;
		};
		return isRecommended;
	};

	function showRecomendation(isRecommended){
		recommendationDiv.empty()
		if (isRecommended){
			recommendationDiv.append("<h2> Recommended!!!</h2><br/><p>If you have kidney diseases, this food is a good choice because it is low in: carbohydrates, protein, potassium, phosphorus,sugar, and sodium. </p>");
		} else{
			recommendationDiv.append("<h2> Not Recommended!!! </h2><br/><p>If you have kidney diseases, this food is a good choice because it is low in: carbohydrates, protein, potassium, phosphorus,sugar, and sodium. </p>");
		}
	};
  
  /////// Events Listeners ///////
  
  saveMealButton.click(function(event){
    event.preventDefault();
    onSaveMeal();
    foodInfoDiv.show();
    foodName.val('');
    datePicker.val('');
    mealType.val('');
  })
  
  

});