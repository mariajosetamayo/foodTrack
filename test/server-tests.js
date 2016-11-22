global.DATABASE_URL = 'mongodb://localhost/foodtrack-test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var Item = require('../models/food');
var app = server.app;

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('main page', function(){
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

// TESTS for add meal
describe('Add meals', function() {
    
    var itemID; 
    
    before(function(done) { //seed db by adding sample data to use in tests
        server.runServer(function() {
            Item.remove(function() {
                Item.create({name: '1 Broad beans can', date: '2016-11-09', meal: 'lunch'},
                {name: '2 Tomatoes', date: '2016-11-08', meal: 'lunch'},
                {name: '1 Apple', date: '2016-11-07', meal: 'breakfast'}, function() {
                done();
                });
            });
        });
    });
    it('should list items of meals on GET', function(done) { //function called to tell mocha that the test has completed. Always include in it blocks.
        chai.request(app) // tells chai to make request to the app
        .get('/meals') // call get to make a get request to the /items endpoint
        .end(function(err, res) { // end method runs the function which you pass in when the request is complete
            should.equal(err, null);
            res.should.have.status(200); // should style assetion says that the response should have a 200 status code
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.length(3);
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('name');
            res.body[0].should.have.property('date');
            res.body[0].should.have.property('meal');
            res.body[0].name.should.be.a('string');
            res.body[0]._id.should.be.a('string');
            res.body[0].date.should.be.a('string');
            res.body[0]._id.should.be.a('string');
            res.body[0].name.should.equal('1 Broad beans can');
            res.body[1].name.should.equal('2 Tomatoes');
            res.body[2].name.should.equal('1 Apple');
            done();
        });
    });
    
    it('should add an item on POST', function(done) {
        chai.request(app)
        .post('/meals')
        .send({'name': 'Kale', date: '2016-11-09', meal: 'lunch' })
        .end(function(err, res) {
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
        chai.request(app) 
        .put('/meals/'+ itemID) 
        .send({name: 'carrot', id:itemID}) 
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
        chai.request(app)
            .delete('/meals/582f930d9015c143ced2d8b0')
            .end(function(err, res) {
                  should.equal(err, null);
                  res.should.have.status(201);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('_id');
                  res.body._id.should.be.a('string');
                  res.body._id.should.equal('582f930d9015c143ced2d8b0');
                  
                  //test db
                  Item.count({}, function( err, count){
                      count.should.equal(4); //test del length
                  })
                  Item.findOne({_id: '582f930d9015c143ced2d8b0'}, 
                    function(err, items){
                        should.equal(items, null);
                    done();
                });
            });
      });
     
    after(function(done) { // run after test is done, removes all items from db
        Item.remove(function() {
            done();
        });
    });
});

// // // FAIL test
describe('Shopping List', function() {
    before(function(done) { //seed db by adding sample data to use in tests
        server.runServer(function() {
            Item.create({name: '1 Broad beans can', date: '2016-11-09', meal: 'lunch'},
                {name: '2 Tomatoes', date: '2016-11-08', meal: 'lunch'},
                {name: '1 Apple', date: '2016-11-07', meal: 'breakfast'}, function() {
                done();
            });
        });
    });
    
    it('should fail when post without body data', function(done){
        chai.request(app)
        .post('/meals')
        .end(function(err, res){
            should.equal(err.message, "Internal Server Error");
            res.should.have.status(500);
            done();
        });
    });
    
    it('should fail when post with something other than a valid JSON', function(done) {
        chai.request(app)
        .post('/meals')
        .end(function(err,res){
            should.equal(err.message, "Internal Server Error");
            res.should.have.status(500);
            done();
        });
    });
    
    it('should fail put without body data', function(done) {
        chai.request(app)
            .put('/meals/2')
            .end(function(err, res){
                should.equal(err.message, "Internal Server Error");
                res.should.have.status(500);
                done();
            });
    });
    
    it('should fail when put with something other than a valid JSON', function(done) {
        chai.request(app)
            .put('/meals/"57fef191c6e2422cc86f265d"')
            .end(function(err, res){
                should.equal(err.message, "Internal Server Error");
                res.should.have.status(500);
                done();
            });
    });
    
    it('should fail when put with a different id in the endpoint than the body', function(done) {
        chai.request(app)
            .put('/meals/"57fef191c6e2422cc86f265d"')
            .send({"name": "Kale", "_id": "57fef191c6e2422cc86f265a"})
            .end(function(err, res){
                should.equal(err.message, "Internal Server Error");
                res.should.have.status(500);
                done();
            });
    });
    
    it('should fail to delete an id that does not exist', function(done) {
        chai.request(app)
            .delete('/meals/367268')
            .end(function(err, res){
                should.equal(err.message, "Internal Server Error");
                res.should.have.status(500);
                done();
            });
    });
    
    it('should fail to delete without an ID in the endpoint', function(done) {
        chai.request(app)
            .delete('/meals')
            .end(function(err, res){
                should.equal(err.message, "Not Found");
                res.should.have.status(404);
                done();
            });
    });
    

    after(function(done) { // run after test is done, removes all items from db
        Item.remove(function() {
            done();
        });
    });
});