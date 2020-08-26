const expect = require('chai').expect;
const sinon = require('sinon');

const Member = require('../models/member');
const AuthController = require('../controllers/auth');


describe('Auth Controller - Login', function() {
  it('should throw an error with code 500 if accessing the databse fails', function() {
    sinon.stub(Member, 'findOne');
    Member.findOne.throws();
    
    const req = {
      flash: 'success message',
      body: {
        email: 'testtest@test.com',
        password: '123123'
      }
    };

    AuthController.postLogin(req, {}, () => {}).then(result => {
      console.log(result);
    });

    Member.findOne().restore();

  });
});