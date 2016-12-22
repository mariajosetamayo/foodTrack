#FoodTrack

##Summary 

Use this application to keep track of what you eat, get recommendations based on the food's nutritional information, and get a daily report summarizing the name and quantity of the nutrients you consumed. 

<img src = "https://cloud.githubusercontent.com/assets/16930791/21410460/165b4230-c79e-11e6-91f1-ef96a668f79f.jpg" width="420"/> <img src = "https://cloud.githubusercontent.com/assets/16930791/21410726/34c8c218-c7a0-11e6-8e54-ea20d56a9e07.jpg" width="400" height="220"/>

<img src = "https://cloud.githubusercontent.com/assets/16930791/21409707/e52bb6f4-c798-11e6-9959-5b213153859a.jpg" width="420"/> <img src = "https://cloud.githubusercontent.com/assets/16930791/21409710/ea5c8252-c798-11e6-96b8-91c40491dce9.jpg" width = "400" height="220"/>

<img src = "https://cloud.githubusercontent.com/assets/16930791/21409722/047c1e9a-c799-11e6-9f8b-a6a235929738.jpg" width="420"/> <img src = "https://cloud.githubusercontent.com/assets/16930791/21409724/0604f8c2-c799-11e6-9afe-9d5f07cf99a0.jpg" width = "400" height="275"/>

##API 

The FoodTrack REST API requires authentication.

###Title

Show all meals.

###URL
/meals
or
/meals/:id

###Methods

GET, POST, PUT, DELETE

###Example GET response

[ { _id: '585b2498b6a5d3134aa97024',
    name: '1 Broad beans can',
    date: '2016-11-09T00:00:00.000Z',
    meal: 'lunch',
    username: 'maria',
    __v: 0,
    nutrients: [] },
  { _id: '585b2498b6a5d3134aa97025',
    name: '2 Tomatoes',
    date: '2016-11-08T00:00:00.000Z',
    meal: 'lunch',
    username: 'mariaaaa',
    __v: 0,
    nutrients: [] },
  { _id: '585b2498b6a5d3134aa97026',
    name: '1 Apple',
    date: '2016-11-07T00:00:00.000Z',
    meal: 'breakfast',
    username: 'maria',
    __v: 0,
    nutrients: [] } ]
    
 
###Example POST response
 
 { _id: 585b2499b6a5d3134aa97028,
  name: 'Kale',
  date: Tue Nov 08 2016 17:00:00 GMT-0700 (MST),
  meal: 'lunch',
  username: 'maria',
  __v: 0,
  nutrients: [] }

##Technology used

- FoodTrack is built using the MEAN stack. 
- The front-end is built using Javascript.
- The back-end is built using NodeJS, ExpressJS, and MongoDB for the database.
- Libraries used include: Bootstrap, jQuery, and Mongoose.
- Authentication is made using Passport.
- Unit tests use Mocha, Chai, Supertest, and Zombie.js.

##Acknowledgments

This app uses the Nutritionix API. 
