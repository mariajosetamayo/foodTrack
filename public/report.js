/////// Variables to selecte elements from the DOM ////////

var mealsTableTitle = $('#mealsTableTitle');
var mealsTableBody = $('#mealsTableBody');

////// Functions to create a daily report /////////

var getValuesForMicronutrients = function(res){
    var valuesForMeals = res.map(function(item){
        for (var i = 0; i< item.nutrients[0].full_nutrients.length; i++){
            var nutrient = item.nutrients[0].full_nutrients[i];
            var nutrientID = nutrient.attr_id;
            var valuesArray = [];
            var calories = item.nutrients[0].nf_calories;
            var carbohydrates = item.nutrients[0].nf_total_carbohydrate;
            var proteins = item.nutrients[0].nf_protein;
            var sodium = item.nutrients[0].nf_sodium;
            var totalFat = item.nutrients[0].nf_total_fat;
            var sugar = item.nutrients[0].nf_sugars;
            if(nutrientID === 305){
                var phosphorus = nutrient.value;
                console.log(phosphorus);
            };
            if(nutrientID === 605){
                var transFat = nutrient.value;
                console.log(transFat);
            };
            if(nutrientID === 606){
                var saturatedFat = nutrient.value;
                console.log(saturatedFat);
            };
            if(nutrientID === 301){
                var calcium = nutrient.value;
                console.log(calcium);
            };
            if(nutrientID === 306){
                var potassium = nutrient.value;
                console.log(potassium);
            };
            if(nutrientID === 324){
                var vitaminD = nutrient.value;
                console.log(vitaminD);
            };
            if(nutrientID === 508){
                var phenilananine = nutrient.value;
                console.log(phenilananine);
            };
            if(nutrientID === 509){
                var tyrosine = nutrient.value;
                console.log(tyrosine);
            };
            if(nutrientID === 510){
                var valine = nutrient.value;
                console.log(valine);
            };
            if(nutrientID === 511){
                var arginine = nutrient.value;
                console.log(arginine);
            };
            if(nutrientID === 512){
                var histiadine = nutrient.value;
                console.log(histiadine);
            };
            if(nutrientID === 513){
                var alanine = nutrient.value;
                console.log(alanine);
            };
            if(nutrientID === 514){
                var asparticAcid = nutrient.value;
                console.log(asparticAcid);
            };
            if(nutrientID === 515){
                var glutamicAcid = nutrient.value;
                console.log(glutamicAcid);
            };
            if(nutrientID === 516){
                var glycine = nutrient.value;
                console.log(glycine);
            };
            if(nutrientID === 517){
                var proline = nutrient.value;
                console.log(proline);
            };
            if(nutrientID === 518){
                var serine = nutrient.value;
                console.log(serine);
            };

        };
        valuesArray.push(calories,carbohydrates,proteins,sodium,totalFat,sugar,phosphorus,transFat,saturatedFat,calcium,potassium,vitaminD,phenilananine,tyrosine,valine,arginine,histiadine,alanine,asparticAcid,glutamicAcid,glycine,proline,serine);
            return valuesArray
    });
    console.log('these are the values for meals', valuesForMeals)
    transposeArray(valuesForMeals)
     
};

var transposeArray = function (micronutrientsArray){
    var transposeMicronutrientsArray = micronutrientsArray[0].map(function(col, i){
        return micronutrientsArray.map(function(row){
            return row[i]
        });
    });
    console.log('this is the transpose array', transposeMicronutrientsArray)
    addedDailyMicronutrients(transposeMicronutrientsArray)
    return transposeMicronutrientsArray
    
}

var addElementsArray = function (item1,item2){
    return item1 + item2;
}

var addedDailyMicronutrients = function (transposeMicronutrientsArray){
    console.log('we are getting here to addedDailyMicronutrients')
    var sumArraysTransposeMicronutrientsArray = transposeMicronutrientsArray.map(function(item){
        var sumItemsInArrays = item.reduce(addElementsArray, 0);
        return sumItemsInArrays;
    })
    console.log('this is the sum in each array', sumArraysTransposeMicronutrientsArray)
}

////// Requests ///////

var getDatesOfMeals = function() {
    var ajax = $.ajax('/getReport/' + window.location.href.split("/")[window.location.href.split("/").length - 1], {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(function(res){
        console.log(res)
        appendMealsToTable(res)
        getValuesForMicronutrients(res)
    });
};

var onDeleteItem = function(id) {
    var ajax = $.ajax('/meals/' + id, {
        type: 'DELETE',
        dataType: 'json'
    });
    ajax.done(function(res){
        console.log('this is the deleted item', res)
    });
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


////// Event Listeners ///////

mealsTableBody.on('click','.remove', function(event){
    event.preventDefault();
    var mealClickedToRemove = $(this).closest('tr').attr('id');
    console.log('this is the variable to be removed', mealClickedToRemove)
    $(this).closest('tr').remove();
    onDeleteItem(mealClickedToRemove);
})

$(document).ready(function(){
    getDatesOfMeals()
    appendTitleToTable()
})