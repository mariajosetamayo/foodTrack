///// Variables to obtain elements from the DOM ///////

var foodNameEnteredByUser = $('#foodInput');
var foodId = $('#foodID');
var datePickedByUserForMeal = $('#date');
var mealTypeSelectedByUser = $('#mealType');
var dateEnteredByUser = $('input[name="date"]');
var datesCalendarContainer = $('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
var saveMealButton = $('#saveBtn');
var containerToDisplayrecommendation = $('#recommendationDiv');
var savedFoodPhoto = $('#foodPhoto');
var containerToDisplayFoodInformation = $('.foodInfo');
var titleOfFoodInformationContainer = $('#foodInfoTitle');
var foodPortionFieldNutritionTable = $('.performance_facts_amount');
var caloriesFieldNutritionTable = $('#calories');
var totalFatFieldNutritionTable = $('#total_fat');
var saturatedFatFieldNutritionTable = $('#saturated_fat');
var cholesterolFieldNutritionTable = $('#cholesterol');
var sodiumFieldTableNutritionTable = $('#sodium');
var carbohydratesFieldNutritionTable = $('#total_carbs');
var fiberFieldNutritionTable = $('#dietary_fiber');
var sugarFieldNutritionTable = $('#sugar');
var proteinFieldNutritionTable = $('#protein');

/////// Requests to server.js ////////

var onSaveMeal = function (mealData){
  var typeOfRequest = foodId.val() ? 'PUT' : 'POST';
  var requestURL = foodId.val() ? '/meals/'+foodId.val() : '/meals';
  mealData.id = foodId.val();

  var ajax = $.ajax(requestURL, {
    type: typeOfRequest,
    data: JSON.stringify(mealData),
    dataType: 'json',
    contentType: 'application/json'
  });
};

/////// Requests to Nutritionix ////////

function requestFoodInformationFromNutritionix(mealData){
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
      mealData.nutrients=data;
      onSaveMeal(mealData)
      showNutritionalValue(data);
      var isRecommended = isFoodRecommended(data);
      showRecomendation(isRecommended);
    },
    error: function (request, status, error) {
      titleOfFoodInformationContainer.text('Sorry! We could not find this food item in our database');
      console.log(request.responseText, status, error);
    },
  });
};

////// Functions to filter data from Nutritionix //////

function isFoodRecommended(data){
  var foodIsRecommended = true;
  for (var i=0; i< data.foods[0].full_nutrients.length; i++){
    var nutrient = data.foods[0].full_nutrients[i];
    var nutrientID = nutrient.attr_id;

    if(nutrientID === 305){
      var phosphorus = nutrient.value;
    }
    if(nutrientID === 605){
      var transFat = nutrient.value;
    }
  };

  var firstMeal =  data.foods[0];
  if ((firstMeal.nf_total_carbohydrate>=60) || (firstMeal.nf_calories> 200) || (firstMeal.serving_weight_grams<15 && firstMeal.nf_calories> 30) || (firstMeal.nf_saturated_fat>3) || (transFat>0) || (firstMeal.serving_weight_grams<15 && firstMeal.nf_calories> 30) || (firstMeal.nf_sodium>=200) || (firstMeal.serving_weight_grams<15 && firstMeal.nf_sugars> 3) || (firstMeal.serving_weight_grams>15 && firstMeal.nf_sugars> 6)){
    foodIsRecommended = false;
  };
  return foodIsRecommended;
};

////// Functions to display data on DOM //////

function showNutritionalValue(data){
  var firstMeal = data.foods[0];
  savedFoodPhoto.attr('src', firstMeal.photo.thumb);
  titleOfFoodInformationContainer.text('Information for' + ' ' + firstMeal.food_name);

  // Nutritional table information fields
  foodPortionFieldNutritionTable.text(firstMeal.serving_weight_grams + " grams");
  caloriesFieldNutritionTable.text(firstMeal.nf_calories + " Kcal");
  totalFatFieldNutritionTable.text(firstMeal.nf_total_fat + " g");
  saturatedFatFieldNutritionTable.text(firstMeal.nf_saturated_fat + " g");
  cholesterolFieldNutritionTable.text(firstMeal.nf_cholesterol + "mg");
  sodiumFieldTableNutritionTable.text(firstMeal.nf_sodium + " mg");
  carbohydratesFieldNutritionTable.text(firstMeal.nf_total_carbohydrate + " g");
  fiberFieldNutritionTable.text(firstMeal.nf_dietary_fiber + " g");
  sugarFieldNutritionTable.text(firstMeal.nf_sugars + " g");
  proteinFieldNutritionTable.text(firstMeal.nf_protein + " g");
}

function showRecomendation(foodIsRecommended){
  containerToDisplayrecommendation.empty();
  if (foodIsRecommended){
    containerToDisplayrecommendation.append("<h2> Recommended!!!</h2><br/><p>If your goal is to keep a healthy weight and a balanced diet, this food is a good choice because it is either low in: carbohydrates, saturated fat, trans fat, sugar, and/or sodium. </p>");
  } else{
    containerToDisplayrecommendation.append("<h2> Not Recommended!!! </h2><br/><p>If your goal is to keep a healthy weight and a balanced diet, this food is not a good choice because it is either high in: carbohydrates, saturated fat, trans fat, sugar, and/or sodium. </p>");
  }
};

// jQuery UI for date picker //

var datesCalendarToSelectDate = {
  format: 'mm/dd/yyyy',
  container: datesCalendarContainer,
  todayHighlight: true,
  autoclose: true,
};

/////// Event Listeners ///////

saveMealButton.click(function(event){
  event.preventDefault();
  if(datePickedByUserForMeal.val().length>0){
    var newMeal = {'name': foodNameEnteredByUser.val(), 'date': datePickedByUserForMeal.val(), 'meal': mealTypeSelectedByUser.val(), 'id': foodId.val()};
    requestFoodInformationFromNutritionix(newMeal);
    containerToDisplayFoodInformation.show();
  }else{
    alert('Date is required');
  }
});

$(document).ready(function () {
  dateEnteredByUser.datepicker(datesCalendarToSelectDate);
  containerToDisplayFoodInformation.hide();
});
