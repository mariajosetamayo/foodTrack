var bodyParser = require('body-parser');
var Authentication = require('./controllers/authentication');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var passport = require('passport');
var Meals = require('./controllers/meals');
var Render = require('./controllers/renders');

module.exports = function (app){

  // Passport Middleware

  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware to verify if user is authenticated

  app.isAuthenticated = function(req, res, next){
    // If the current user is logged in
    if( req.isAuthenticated() ){
      // Middleware allows the execution chain to continue/Middleware
      return next();
    }
    // If not, redirect to login
    res.redirect('/');
  };

  // Sign up, log in, log out endpoints

  app.post('/signup', jsonParser, Authentication.signup);
  app.post('/login', Authentication.login);
  app.get("/logout", function (req,res) {
    req.logOut();
    res.redirect('/');
  });

  // Render endpoints

  app.get('/', Render.home);
  app.get('/user-home', app.isAuthenticated, Render.userHome);
  app.get('/addFood', app.isAuthenticated, Render.addFood);
  app.get('/addFood/:id', app.isAuthenticated, Render.editFood);
  app.get('/signup', Render.signUp);
  app.get('/report/:date', app.isAuthenticated, Render.report);
  app.get('/getReport/:date', app.isAuthenticated, Render.reportDate);


  /// Meal Endpoints

  app.get('/meals', app.isAuthenticated, Meals.userMeals);
  app.post('/meals', app.isAuthenticated, Meals.newMeal);
  app.put('/meals/:id', app.isAuthenticated, Meals.editMeal);
  app.delete('/meals/:id', app.isAuthenticated, Meals.deleteMeal);
  app.post('/reports', app.isAuthenticated, Meals.report);
}
