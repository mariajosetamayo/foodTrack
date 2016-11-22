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
  var foodId = $('#foodID');
  var datePicker = $('#date');
  var mealType = $('#mealType');
  var saveMealButton = $('#saveBtn');
  var recommendationDiv = $('#recommendationDiv');
  var foodPhoto = $('#foodPhoto');
  var foodInfoDiv = $('.foodInfo');
  var foodInfoTitle = $('#foodInfoTitle');
  var nutritionTableAmount = $('.performance_facts_amount');
  var caloriesFieldTable = $('#calories');
  var totalFatFieldTable = $('#total_fat');
  var saturatedFatFieldTable = $('#saturated_fat');
  var cholesterolFieldTable = $('#cholesterol');
  var sodiumFieldTable = $('#sodium');
  var carbohydratesFieldTable = $('#total_carbs');
  var fiberFieldTable = $('#dietary_fiber');
  var sugarFieldTable = $('#sugar');
  var proteinFieldTable = $('#protein');


  foodInfoDiv.hide();

  /////// Requests ////////

  var onSaveMeal = function (mealData){
    // name = foodName.val();
    // date = datePicker.val();
    // meal = mealType.val();
    console.log("this is the food name", mealData.name)
    console.log('this is the date', mealData.date)
    console.log('this is the meal', mealData.meal)
    console.log('this is the data', mealData.data)

    console.log('this is the new meal', mealData)

    var typeOfRequest = foodId.val() ? 'PUT' : 'POST';
    var requestURL = foodId.val() ? '/meals/'+foodId.val() : '/meals';
    mealData.id = foodId.val();

    var ajax = $.ajax(requestURL, {
        type: typeOfRequest,
        data: JSON.stringify(mealData),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res){
      console.log('this is the saved meal', res)
    });
  };


  /////// Requests to Nutritionix ////////

  function getFoodRequest(mealData){
		var searchTerm = mealData.name;
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
          mealData.nutrients=data;
    			onSaveMeal(mealData)
    			showNutritionalValue(data);
    			var isRecommended = isFoodRecommended(data);
				  showRecomendation(isRecommended);
  			},
  			error: function (request, status, error) {
    			// Estos console.log te dan informacion del error.
          foodInfoTitle.text('Sorry! We could not find this food item in our database');
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

		if ((data.foods[0].nf_total_carbohydrate>=60) || (data.foods[0].nf_calories> 200) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30) || (data.foods[0].nf_saturated_fat>3) || (transFat>0) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30) || (data.foods[0].nf_sodium>=200)){
			isRecommended = false;
		};
		return isRecommended;
	};

	////// Functions to display data on DOM //////

	function showNutritionalValue(data){
		foodPhoto.attr('src', data.foods[0].photo.thumb);
		foodInfoTitle.text('Information for:' + ' ' + data.foods[0].food_name);
		// Nutritional table information fields
    nutritionTableAmount.text(data.foods[0].serving_weight_grams + " grams");
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
			recommendationDiv.append("<h2> Recommended!!!</h2><br/><p>If your goal is to keep a healthy weight and a balanced diet, this food is a good choice because it is either low in: carbohydrates, saturated fat, trans fat, sugar, and/or sodium. </p>");
		} else{
			recommendationDiv.append("<h2> Not Recommended!!! </h2><br/><p>If your goal is to keep a healthy weight and a balanced diet, this food is not a good choice because it is either high in: carbohydrates, saturated fat, trans fat, sugar, and/or sodium. </p>");
		}
	};

  /////// Events Listeners ///////

  saveMealButton.click(function(event){
    event.preventDefault();
    var newMeal = {'name': foodName.val(), 'date': datePicker.val(), 'meal': mealType.val(), 'id': foodId.val()};
    getFoodRequest(newMeal)
    foodInfoDiv.show();
  })
});
