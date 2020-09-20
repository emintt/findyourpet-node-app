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
      .catch(err => { console.log(err); });
    });

    afterEach(function() {
      Member.destroy({
        where: {
          email: testEmail
        }
      })
      .catch(err => {
        console.log(err);
      });
    });
  });

  describe('Update a member of database', function() {
    const testMember = 'testMember';
    const testPassword = '$2a$12$z8.kdiWud.tz5gv2odnWuumchdt3GGbj6jntzYokDx4.bgV7Gkg4K';
    const testEmail = "test@test.com";
    const testPhone = "0401111111";

    const testMember2 = 'testMember2';
    const testPassword2 = '$2a$12$akMm8MCk9Xs4hyTAYsqCiuXL9E8dfa8OIzQdNm88xhMtKFR6gimli';
    const testEmail2 = "test2@test.com";
    const testPhone2 = "0402222222";
    beforeEach(function(done) {
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
        console.log(err);
      })
    });
    it('should receive one array of 1 after 1 row updated succesfully', (done) => {
      let updatedName = 'testMember Updated';
      Member.update(
        { name: updatedName },
        { where: {
          email: testEmail
        } }
      )
      .then(result => {
        expect(result).to.be.an('array').to.eql([1]);
        done();
      })
      .catch(done);
    });
    it('should responds with an updated object after updated succesfully', (done) => {
      let updatedPhoneNumber = '0454333333';
      Member.update(
        { phoneNumber: updatedPhoneNumber },
        { where: {
          email: testEmail
        } }
      )
      .then(result => {
        Member
          .findOne({ where: { email: testEmail }})
          .then(member => {
            expect(member.get('phoneNumber')).to.equal(updatedPhoneNumber);
            done();
          })
          .catch(done);
      })
      .catch(err => {
        console.log(err);
      });
    });
    it('can update multiple members at a time', (done) => {
      let updatedName1 = 'test name updated 1';
      let updatedName2 = 'test name updated 2';
      Member.create({
        email: testEmail2, 
        password: testPassword2, 
        name: testMember2, 
        phoneNumber: testPhone2
      })
        .then(member => {
          Member.update(
            { name: updatedName1 },
            { where: { email: testEmail } }
          )
            .then(result => {
              return Member.update(
                { name: updatedName2 },
                { where: { email: testEmail2 } }
              )
            })
            .then(result => {
              return Member.findAll({ 
                where: { email: [ testEmail, testEmail2 ] }
              })
            })
            .then(members => {
              // console.log(JSON.stringify(members));
              expect(members).to.be.an('array').to.have.lengthOf(2);
              expect(members[0]).to.have.property('name', updatedName1);
              expect(members[1]).to.have.property('name', updatedName2);
              done();
            })
            .catch(done);
        })
        .catch(err => console.log(err));
    });



    afterEach(function() {
      Member.destroy({
        where: {
          email: [ testEmail,testEmail2 ]
        }
      })
      .catch(err => {
        console.log(err);
      });
    });
  });

  describe('Delete a member from database', function() {
    const testMember = 'testMember';
    const testPassword = '$2a$12$z8.kdiWud.tz5gv2odnWuumchdt3GGbj6jntzYokDx4.bgV7Gkg4K';
    const testEmail = "test@test.com";
    const testPhone = "0402222222";
    beforeEach(function(done) {
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
        console.log(err);
      })
    });
    it('should return 1 when object was deleted successfully', (done) => {
      Member.destroy({
        where: { email: testEmail }
      })
      .then(result => {
        // result === 1 means destroy successfully
        expect(result).to.equal(1);
        done();
      })
      .catch(done);
    });






    // afterEach(function() {
    //   Member.destroy({
    //     where: {
    //       name: testMember
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // });
  });
});