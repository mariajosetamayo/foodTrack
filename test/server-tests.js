global.DATABASE_URL = 'mongodb://localhost/foodtrack-test';
// global.DATABASE_URL = 'mongodb://mjtamayo:milanka@ds155737.mlab.com:55737/foodtrack';
// global.DATABASE_URL = 'mongodb://jack:jack@ds023118.mlab.com:23118/blackjack';

var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var Item = require('../models/food');
var User = require('../models/users');


var app = server.app;

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

var request = require('supertest');
var server2 = request.agent('http://localhost:3000');


describe('main page', function(){

  before(function(done) {
    //Guarantees DB is connected BEFORE tests
    server.runServer(function() {
      User.remove(function(){console.log("db cleaned!")})
      Item.remove(function(){
        Item.create({name: '1 Broad beans can', date: '2016-11-09', meal: 'lunch', nutrients:[], username: 'mariaaaa'},
        {name: '2 Tomatoes', date: '2016-11-08', meal: 'lunch', nutrients:[], username: 'mariaaaa'},
        {name: '1 Apple', date: '2016-11-07', meal: 'breakfast', nutrients:[], username: 'mariaaaa'}, function() {
          done();
        });
      });
    });
  });

  it('exists', function(done){
    chai.request(app)
    .get('/')
    .end(function(err,res){
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });
});


describe('login / logout tests:', function(){

  it('User be able to signup', function(done){
    chai.request(app)
    .post('/signup')
    .send({ username: 'mariaaaa', password: 'maria' })
    .end(function(err,res){
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('username');
      res.body._id.should.be.a('string');
      done();
    })
  });

  it('User be able to logout', function(done){
    chai.request(app)
    .get('/logout')
    .end(function(err,res){
      res.should.have.status(200);
      done();
    });
  });

  it('User be able to login:', function(done){
    chai.request(app)
    .post('/login')
    .send({ username: 'mariaaaa', password: 'maria' })
    .end(function(err,res){
      //console.log(res)
      res.should.have.status(200);
      res.should.be.json;
      should.equal(err, null);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal('success');
      // res.body.should.to.have.property('token');
      // token = res.body.token;

      done();
    });
  });
  it('login exp', function(done) {
    server2
    .post('/login')
    .send({ username: 'mariaaaa', password: 'maria' })
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      res.should.have.status(200);
      res.should.be.json;
      should.equal(err, null);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal('success');
      return done();
    })
  });

  it('should list items of meals on GET (requires to be logged in)', function(done){
    server2
    .get('/meals')
    .expect(200)
    .end(function(err, res){
      if (err) return done(err);
      console.log(res.body);
      res.should.have.status(200); // should style assetion says that the response should have a 200 status code
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.should.have.length(3);
      res.body[0].should.be.a('object');
      res.body[0].should.have.property('_id');
      res.body[0].should.have.property('name');
      res.body[0].should.have.property('date');
      res.body[0].should.have.property('meal');
      res.body[0].should.have.property('username');
      res.body[0].name.should.be.a('string');
      res.body[0]._id.should.be.a('string');
      res.body[0].date.should.be.a('string');
      res.body[0]._id.should.be.a('string');
      res.body[0].name.should.equal('1 Broad beans can');
      res.body[1].name.should.equal('2 Tomatoes');
      res.body[2].name.should.equal('1 Apple');
      done()
    });
  });


  it('should add an item on POST', function(done) {
    server2
    .post('/meals')
    .send({'name': 'Kale', date: '2016-11-09', meal: 'lunch', nutrients:[], username: 'mariaaaa' })
    .end(function(err, res){
      should.equal(err, null);
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('name');
      res.body.should.have.property('_id');
      res.body.should.have.property('date');
      res.body.should.have.property('meal');
      res.body.name.should.be.a('string');
      res.body.date.should.be.a('string');
      res.body.meal.should.be.a('string');
      res.body._id.should.be.a('string');
      res.body.name.should.equal('Kale');
      itemID=res.body._id;
      // Test database

      Item.count({}, function( err, count){
        count.should.equal(4); //test del length
      })
      Item.findOne({name: 'Kale'},
      function(err, items){
        console.log("error"+ err)
        console.log("items"+ items)
        items.name.should.equal('Kale');
        done();
        // buscar que findOne usando res.body._id
        // longitud ++
      });
    });
  });

  it('should edit a new item on PUT', function(done) {
    server2
    .put('/meals/'+ itemID)
    .send({name: 'carrot', id:itemID, date: '2016-11-12', meal: 'lunch', nutrients:[], username: 'mariaaaa'})
    .end(function(err, res) {
      should.equal(err, null);
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('name');
      res.body.should.have.property('_id');
      res.body.name.should.be.a('string');
      res.body._id.should.be.a('string');
      res.body.name.should.equal('carrot');


      // tests database
      Item.count({}, function( err, count){
        count.should.equal(4); //test del length
      });

      Item.findOne({_id: itemID},
        function(err, items){
          should.not.equal(items, null);
          items.name.should.equal('carrot');  //find one y ver si se actualizo.
          done();
        });
      });
    });

    it('should delete an item on delete', function(done) {
      server2
      .delete('/meals/'+ itemID)
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body._id.should.be.a('string');
        res.body._id.should.equal(itemID);

        //test db
        Item.count({}, function( err, count){
          count.should.equal(3); //test del length
        })
        Item.findOne({_id: itemID},
        function(err, items){
          should.equal(items, null);
          done();
        });
      });
    });
  });

  var Browser = require('zombie');
  var assert = require('assert');
  var Url = require("url");

  Browser.localhost('foodtrack.com', 3000);


  describe('User visits user-home', function(){
    it('should show a welcome message for user');
    it ('should take user to add food page when button is clicked');
    it ('should take user to food report when date is clicked');
  });

  describe('User visits add food page', function(){
    it('should allow user to fill form for meal information');
    it('should POST the meal when click is pressed');
  });

  describe('User visits report page', function(){
    it('should display the saved meal and its details');
  })

  // var browser = new Browser();

  // before(function(done){
  //     browser.visit('/user-home');
  //     done();
  // });

  // describe('takes user to add item when button is pressed', function(){
  //     // before(function(done){
  //     //     browser
  //     //         .pressButton('add a meal');
  //     //         done();
  //     // });

  //     it('should welcome user', function(){
  //         browser.assert.text('title', 'Welcome username');
  //     });
  // });

  // it('should show the user-home', function(){
  //     browser.assert.sucess();
  // });

  // before(function(){
  //     this.server = http.createServer(app).listen(3000);
  //     this.browser = new Browser({site:'http://localhost:3000'});
  // });

  // beforeEach(function(done){
  //     this.browser.visit('/user-home', done);
  // });

  // it('should show the user-home page', function(){
  //     assert.ok(this.browser.sucess);
  // });

  // after(function(done){
  //     this.server.close(done);
  // });
