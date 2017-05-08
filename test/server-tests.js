global.DATABASE_URL = 'mongodb://localhost/foodtrack-test';

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
      res.should.have.status(200);
      res.should.be.json;
      should.equal(err, null);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.equal('success');
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
      res.should.have.status(200);
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
      // res.body[0].name.should.equal('1 Broad beans can');
      // res.body[1].name.should.equal('2 Tomatoes');
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

      Item.count({}, function( err, count){
        count.should.equal(4);
      })
      Item.findOne({name: 'Kale'},
      function(err, items){
        items.name.should.equal('Kale');
        done();
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
      Item.count({}, function( err, count){
        count.should.equal(4);
      });
      Item.findOne({_id: itemID},
        function(err, items){
          should.not.equal(items, null);
          items.name.should.equal('carrot');
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
        Item.count({}, function( err, count){
          count.should.equal(3);
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
  Browser.localhost('example.com',3000);

  describe('User visits user-home', function(){
    var browser = new Browser ();

    before(function(done){
      return browser.visit('/user-home', done);
    });

    it('should show welcome page', function(){
      browser.assert.success();
      browser.assert.text('title', 'FoodTrack');
      browser.assert.text('h1', '');
    });

    it('should take to add meal page when button is clicked', function(){
      browser.pressButton('button', function(){
        browser.assert.success();
        browser.assert.redirected();
        browser.assert.equal('http://localhost:3000/addFood', b.location.href);
      });
    });
  });

  describe('User visits add meal page', function(){

    var browser = new Browser();

    before(function(done){
      return browser.visit('/addFood', done);
    });

    it('should show add meal page', function(){
      browser.assert.success();
      browser.assert.elements('form', 1);
      browser.assert.elements('form input', 2);
    });

    it('should set value of meal inputs and save the meal', function(){
      browser.fill('input', 'carrot');
      browser.fill('input', '12-15-2016');
      browser.selectOption('#mealType', 'lunch');
      browser.pressButton('button', function(){
          browser.assert.success();
          browser.assert.equal(('input').value, 'carrot');
          browser.assert.equal(('input').value, '12-15-2016');
          browser.assert.equal(('#mealType').value, 'lunch');
      });
    });
  });
