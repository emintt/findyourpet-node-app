const bcrypt = require('bcryptjs');

const Member = require('../models/member');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Sign up',
    isAuthenticated: false
  });
}

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login', 
    pageTitle: 'Log in',
    isAuthenticated: false
  })
}

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const confirmPassword = req.body.confirmPassword;
  console.log(req.body.password);
  Member.findOne({
    where: { email: req.body.email } 
  })
    .then(memberInfo => {
      if (memberInfo) {
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const member = Member.build({
            email: email, 
            password: hashedPassword, 
            name: name, 
            phoneNumber: phoneNumber
          })
        return member.save();
        })
        .then(result => {
          res.redirect('/login')
        })
    })
    .catch(err => {console.log(err)});
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Member
    .findOne({where: {email: email}})
    .then(member => {
      if (!member) {
        res.redirect('/login');
      }
      console.log(JSON.stringify(password));
      bcrypt
        .compare(password, member.password)
        .then(result => {
          if (result) {
            // result === true means passwords are the same.
            req.session.member = member;
            req.session.isLoggedIn = true;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            })
          }
          res.redirect('/login');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}