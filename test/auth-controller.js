const expect = require('chai').expect;
const sinon = require('sinon');

const Member = require('../models/member');
const AuthController = require('../controllers/auth');

const { validationResult } = require('express-validator');


describe('Auth Controller - Login', function() {
  it('should throw an error with code 500 if accessing the dataabse fails', function(done) {
    //sinon.stub(Member, 'findOne'); 
    //Member.findOne.throws();
    
    
    const req = {
      flash: sinon.spy(),
      body: {
        email: 'testtest@test.com',
        password: '123123'
      }
    };
    
    AuthController.postLogin(req, {}, () => {}).then(result => {
      console.log(result);
      console.log(req.flash('success'));
      expect(result).to.be.an('error');
      done();
    });

    Member.findOne().restore();

  });
});