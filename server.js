var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var config = require('./config');

var app = express();
var session = require('express-session')

// set the view engine to ejs
app.set('view engine', 'ejs');


// MIDDLEWARE SETUP

app.sessionMiddleware = session({
  secret: 'Maria Marcela Veronica Felicitas Emilia Ortiz Aveleyra Castillo Ortiz Mena',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2628000000 },
})


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/scripts'));
app.use(express.static(__dirname + '/public/styles'));
app.use(express.static(__dirname + '/public'));

app.use(app.sessionMiddleware);

///// Function for running the server //////

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

////// Passport strategy setup //////

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//Passport local strategy fetches user which matches username provided. 

var strategy = new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            console.log("this is the user", user)
            if (err) { 
                return done(err); 
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user.password, function(error, response){
                if (response === true){
                    return done(null,user)
                }
                else {
                    return done(null, false)
                }
            })
        });
    }
);


app.isAuthenticated = function(req, res, next){
    // If the current user is logged in.../si el usuario esta "logineado"...
    if( req.isAuthenticated() ){
    // Middleware allows the execution chain to continue/Middleware permite que se siga ejecutando el codigo
        return next();
    }
    // If not, redirect to login/Si no, redirige a la pagina de unirse
    res.redirect('/');
};



// var app = express();
var jsonParser = bodyParser.json();

passport.use(strategy);

////// Endpoints //////

//// Rendering Endpoints //////

// Endpoint para home -> que haga render de home
// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});
// Endpoint for rendering user-home 
app.get('/user-home/:username', app.isAuthenticated, function (req, res){
    res.render('pages/user-home', {username:req.user.username});
});
// Endpoint for rendering addfood page
app.get('/addFood', app.isAuthenticated, function (req, res){
    res.render('pages/add-food');
});
// Endpoint for redenring signup
app.get('/signup', function (req, res){
    res.render('pages/signup');
})
// Endpoint for getting report
app.get('/report/:date', app.isAuthenticated, function (req, res) { // we include the date in the endpoint so we can go another get request when the page loads
    res.render('pages/report')
})
app.get('/getReport/:date', app.isAuthenticated, function(req, res){
    console.log("are we hitting the getReport endpoint???")
    console.log('we are hitting report endpoint and the date sent is ', req.params)
    var oneDayAfter = new Date(req.params.date) // set format for date
    oneDayAfter.setDate(oneDayAfter.getDate() + 1) // assign variable the value of the day after the date request
    console.log("date searched is", req.params.date, " and one day later it is the ", oneDayAfter)
    Item.find({username: req.user.username, date : {$gte : new Date(req.params.date), $lt : new Date(oneDayAfter)}}, function(err, foundMeals){ // here we query the db to find the entries that match the present day.
                                                                                                                    // We know it is the present day because it has to be between 12am of request day and 12am on the next day
        if (err) {
            res.send(err)
        } else {
            console.log("the meals found are the following: ", foundMeals)
            res.send(foundMeals) // these are the meals found which match the request date
        }
    })
})

////// Passport endpoints /////

// Endpoint for login
app.post('/login', function(req, res, next){
    console.log("this is the request", req.body)
    passport.authenticate('local', function(err, user, info) {
        console.log("this is the user", user)
        // user = req.body
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.send({error : 'something went wrong :('}); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            console.log("this is the username", req.user.username)
            return res.send({success:'success'});
        });
    }) (req, res, next);
})


// Endpoint for creating users  
app.post('/signup', jsonParser, function(req, res) {
    console.log("we are hitting the users endpoint and the request receiced is", req.body)
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();
    
    // Password hashing
    bcrypt.genSalt(10, function(err, salt) { // takes number 10 to indicate how many rounds of salting algorythm should be used
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
            
            console.log(salt)
        }

        console.log("we are getting just before the hash part! username and password are ", username, password)

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                console.log("there was an error hashing!")
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            
            console.log("we are about to create the user!")

            var user = new User({
                username: username,
                password: hash
            });
            
            console.log("user created and is: ", user)

            user.save(function(err, user) {
                if (err) {
                    console.log("error saving the user!!! ", err)
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }
                console.log("AW YISS!!!")
                return res.status(201).json(user);
            });
        });
    });
});

// logs present user out
app.get("/logout", function (req,res) {
    console.log('this is also doing something on logout in the server')
	req.logOut()
	res.redirect('/')
});

////// Endpoints for adding food ///////

var Item = require('./models/food');

// endpoint to get the meals
app.get('/meals', function(req, res) {
    Item.find({ username: req.user.username }, function(err, items) { //fetches a list of all the items from the DB using find. Returns json
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(items);
    });
});

// enpoint to post a new meal
app.post('/meals', function(req, res) {
	console.log("WE ARE HITTING THE MEALS ENDPOINT!!!! ", req.body)
        Item.create({name: req.body.name, date: new Date(req.body.date), meal: req.body.meal, nutrients: req.body.nutrients, username: req.user.username }, 
        function(err, items) {
            if (err) {
            	console.log("GOT AN ERROR BRAH ", err)
            	return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        console.log("GREAT SUCCESS!!!")
        res.status(201).json(items);
    });
});

// enpoint to change a meal
app.put('/meals/:id', function(req, res){
        var queryID = {_id: req.params.id}
        var updateItem = {name: req.body.name, _id: req.params.id, date: req.body.date, meal: req.body.meal, nutrients: req.body.nutrients}
        console.log("UPDATED ITEM", updateItem)
        Item.findOneAndUpdate(queryID, updateItem,
        function(err, items){
            if(err) {
                return res.status(500).json({
                message: 'Internal Server Error'});
            }
             console.log("UPDATED ITEM", updateItem)
            res.status(201).json(updateItem)
        });
         console.log("UPDATED ITEM", updateItem)
});

// enpoint to delete a meal
app.delete('/meals/:id', function(req, res){
        var chosenItemID = {_id: req.params.id}
        Item.findOneAndRemove({_id: req.params.id},
        function(err, item){
            if(err){
                return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(chosenItemID)
    });
});

// endpoint for selected date
app.post('/reports', function(req, res){
    var chosenMealToView = {meals: req.body}
    res.json(chosenMealToView);
})



////// Event listeners ///////



exports.app = app;
exports.runServer = runServer;




// CRUD para los meals
// Test CRUD
// probrar con postman. 
// Arreglar los navbars. sign in sign. 






// Despues. 
// un GET endpoint /user-days -> Query a meals, que seleccines los dates, Unique. 


// Endpoint para signup -> que haga render de pag de sign up
// app.get('/signup', function(req,res){
//   res.sendFile(__dirname + '/public/signup.html');
//   console.log(__dirname)
// });

// Endpoint para user home -> que haga render de pag de user home
// app.get('/user-home',function(req,res){
//   res.sendFile(__dirname + '/public/user-home.html');
//   console.log(__dirname)
// });

// Endpoint para add food -> que haga render de pag de add food
// app.get('/addFood',function(req,res){
//   res.sendFile(__dirname + '/public/addFood.html');
//   console.log(__dirname)
// });
// // Endpoint para report -> que haga render de pag de report
// app.get('/report',function(req,res){
//   res.sendFile(__dirname + '/public/report.html');
//   console.log(__dirname)
// });
