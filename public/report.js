/////// Variables to obtain elements from the DOM ////////

var mealsTableTitle = $('#mealsTableTitle');
var reportTableTitle = $('#nutritionInfoTitle')
var mealsTableBody = $('#mealsTableBody');
var reportTableBody = $('#reportTableBody');

////// Functions to create a report that adds the nutrients for all the meals consumed/registered in one day /////////
var obtainValuesForNutrients = function(res){
  var nutrientValuesForAllMeals = res.map(function(item){
    for (var i = 0; i< item.nutrients[0].foods[0].full_nutrients.length; i++){
      var firstFood = item.nutrients[0].foods[0];
      var nutrient = firstFood.full_nutrients[i];
      var nutrientID = nutrient.attr_id;
      var micronutrientsValuesArray = [];
      var calories = {nutrient:'Calories', value: firstFood.nf_calories, units: 'Kcal'};
      var carbohydrates = {nutrient: 'Carbohydrates', value: firstFood.nf_total_carbohydrate, units: 'g'};
      var proteins = {nutrient: 'Proteins', value: firstFood.nf_protein, units: 'g'};
      var sodium = {nutrient: 'Sodium', value: firstFood.nf_sodium, units: 'mg'};
      var totalFat = {nutrient: 'totalFat', value: firstFood.nf_total_fat, units: 'g'};
      var sugar = {nutrient: 'Sugar', value: firstFood.nf_sugars, units: 'g'};
      if(nutrientID === 305){
        var phosphorus = {nutrient: 'Phosphorus', value: nutrient.value, units: 'mg'};
      }
      if(nutrientID === 605){
        var transFat = {nutrient: 'Trans Fat', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 606){
        var saturatedFat = {nutrient: 'Saturated Fat', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 301){
        var calcium = {nutrient: 'Calcium', value: nutrient.value, units: 'mg'};
      }
      if(nutrientID === 306){
        var potassium = {nutrient: 'Potassium', value: nutrient.value, units: 'mg'};
      }
      if(nutrientID === 324){
        var vitaminD = {nutrient: 'Vitamin D', value: nutrient.value, units: 'IU'};
      }
      if(nutrientID === 508){
        var phenilananine = {nutrient: 'Phenylananine', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 509){
        var tyrosine = {nutrient: 'Tyrosine', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 510){
        var valine = {nutrient: 'Valine', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 511){
        var arginine = {nutrient: 'Arginine', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 512){
        var histiadine = {nutrient: 'Histiadine', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 513){
        var alanine = {nutrient: 'Alanine', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 514){
        var asparticAcid = {nutrient: 'Aspartic Acid', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 515){
        var glutamicAcid = {nutrient: 'Glutamic Acid', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 516){
        var glycine = {nutrient: 'Glycine', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 517){
        var proline = {nutrient: 'Proline', value: nutrient.value, units: 'g'};
      }
      if(nutrientID === 518){
        var serine = {nutrient: 'Serine', value: nutrient.value, units: 'g'};
      }
    };
    micronutrientsValuesArray.push(calories,carbohydrates,proteins,sodium,totalFat,sugar,phosphorus,transFat,saturatedFat,calcium,potassium,vitaminD,phenilananine,tyrosine,valine,arginine,histiadine,alanine,asparticAcid,glutamicAcid,glycine,proline,serine);
    return micronutrientsValuesArray;
  });
  addNutrientsForAllMeals(nutrientValuesForAllMeals);
};

var addNutrientsForAllMeals = function (nutrientValuesForAllMeals){
  var nutrientsInformationArray = []
  for (var i = 0; i < 23; i++) {
    nutrientsInformationArray.push({
      nutrient: '',
      value: 0
    });
  };
  var addedNutrientsArray = nutrientValuesForAllMeals.map(function (item){
    item.map(function (nutrient, index) {
      nutrientsInformationArray[index].nutrient = (nutrient && nutrient.nutrient) ? nutrient.nutrient : nutrientsInformationArray[index].nutrient;
      nutrientsInformationArray[index].value = (nutrient && nutrient.value) ? nutrientsInformationArray[index].value + nutrient.value : nutrientsInformationArray[index].value;
      nutrientsInformationArray[index].units = (nutrient && nutrient.units) ? nutrient.units : nutrientsInformationArray[index].units;
    });
  });
  appendValuesToReportTable(nutrientsInformationArray);
  return nutrientsInformationArray;
};


////// Requests to server.js///////
var getDatesOfMeals = function() {
  var ajax = $.ajax('/getReport/' + window.location.href.split("/")[window.location.href.split("/").length - 1], {
    type: 'GET',
    dataType: 'json'
  });
  ajax.done(function(res){
    appendMealsToMealsTable(res);
    obtainValuesForNutrients(res);
  });
};

var onDeleteMeal = function(id) {
  var ajax = $.ajax('/meals/' + id, {
    type: 'DELETE',
    dataType: 'json'
  });
  ajax.done(function(res){
    location.reload();
  });
};

////// Functions to display elements in DOM //////
var appendTitleToTables = function(){
  mealsTableTitle.text('Meals for the' + ' ' + window.location.href.split("/")[window.location.href.split("/").length - 1]);
  reportTableTitle.text('Report for the' + ' ' + window.location.href.split("/")[window.location.href.split("/").length - 1]);
};

var appendMealsToMealsTable = function(meals){
  for(var i = 0; i<meals.length; i ++){
    mealsTableBody.append('<tr id = '+ meals[i]._id +'><th scope="row">' + meals[i].name + '</th><td>' + meals[i].meal + '</td><td><a href="/addFood/'+meals[i]._id+'">Edit</a></td><td><a class = "remove">Remove</a></td></tr>');
  };
};

var appendValuesToReportTable = function(totalNutrients){
  for(var i = 0; i<totalNutrients.length; i ++){
    if(totalNutrients[i].value> 0.01){
      reportTableBody.append('<tr><th scope="row">' + totalNutrients[i].nutrient + '</th>' + '<td>' + totalNutrients[i].value.toFixed(2) + ' ' + totalNutrients[i].units +'<td></tr>');
    }
  };
};

////// Event Listeners ///////
mealsTableBody.on('click','.remove', function(event){
  event.preventDefault();
  var mealClickedToRemove = $(this).closest('tr').attr('id');
  $(this).closest('tr').remove();
  onDeleteMeal(mealClickedToRemove);
});

$(document).ready(function(){
  getDatesOfMeals();
  appendTitleToTables();
});
