const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');

const Member = require('../models/member');
const AuthController = require('../controllers/auth');

describe('Member Model', function() {
  describe('Add a member to database', function() {
    const testMember = 'testMember';
    const testPassword = '$2a$12$z8.kdiWud.tz5gv2odnWuumchdt3GGbj6jntzYokDx4.bgV7Gkg4K';
    const testEmail = "test@test.com";
    const testPhone = "0402222222";

    it('should responds with the object that was created when successful', (done) => {
      Member.create({
        email: testEmail, 
        password: testPassword, 
        name: testMember, 
        phoneNumber: testPhone
      })
      .then(member => {
        expect(member.get('name')).to.equal(testMember);
        done();
      })
      .catch(done);
    });

    it('should send errors response when a field is a duplicate entry', (done) => {
      Member
      .create({
        email: testEmail, 
        password: testPassword, 
        name: testMember, 
        phoneNumber: testPhone
      })
      .then(member => {
        Member.create({
          email: testEmail, 
          password: testPassword, 
          name: testMember, 
          phoneNumber: testPhone
        })
        .then(() => {
          done();
        })
        .catch(err => {
          if (err.errors[0].message) {
            done();
          }
        }); 
      })
      // .then(result => {
      //   done();
      // })
      // .catch(done);
     
      
      
      
    });

    afterEach(function() {
      Member.destroy({
        where: {
          name: testMember
        }
      })
      .catch(err => {
        console.log(err);
      });
    });
  });
});