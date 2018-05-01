//During the test the env variable is set to test
//process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let users = require('../dist/lib/models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/index');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('users', () => {
   // beforeEach((done) => { //Before each test we empty the database
    //    users.remove({}, (err) => { 
    //       done();         
    //    });     
   // });
/*
   Test the /GET route
*/
describe('/GET user', () => {
    it('it should GET all the users', (done) => {
      chai.request('http://localhost:4000/api')
          .get('/user')
          .end((err, res) => {
              console.log(res)
              res.should.have.status(200);
             // res.body.should.be.a('array');
             // res.body.length.should.be.eql(2);
            done();
          });
    });
});

});