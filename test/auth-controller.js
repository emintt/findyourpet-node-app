const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');

const Member = require('../models/member');
const AuthController = require('../controllers/auth');



describe('Member model - Login', function() {
  it('should return ', function(done) {
    let testEmail = 'elminguyen@gmail.com';

    Member
    .findOne({where: {email: testEmail}})
    .then(member => {
      console.log(member.email);
      assert.equal(member.email, 'elminguyen@gmail.com'); 
    }).then(done, done);  
  });    
});  

// describe('Auth Controller - Login', function() {
//   it('should throw an error with code 500 if accessing the dataabse fails', function(done) {
//     beforeEach(function() {});
//     sinon.stub(Member, 'findOne'); 
//     Member.findOne.throws();
    
//     const req = {
//       flash: function() {},
//       body: {
//         email: 'elminguyen@gmail.com',
//         password: '121212'
//       }
//     };
    
    
//     sinon.spy(req, 'flash');
//     AuthController.postLogin(req, {}, () => {}).then(result => {
//       console.log(result);
//       expect(result).to.be.an('error');
//       done(); 
//     }, err => {
//       done(err);
//     });

//     afterEach(function() {});
//     Member.findOne().restore();
//     req.flash().restore();
//   });
// });
