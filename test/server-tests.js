var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

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

describe('signup page', function(){
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

describe('add food page', function(){
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

describe('report page', function(){
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