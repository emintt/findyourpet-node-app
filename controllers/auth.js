const bcrypt = require('bcryptjs');

const Member = require('../models/member');

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    pageTitle: 'Sign up',
    errorMessage: message
  });
}

exports.getLogin = (req, res, next) => {
  
  // message will come in an array
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  let successMessage = req.flash('success');
  successMessage = successMessage.length > 0 ? successMessage[0] : null;

  res.render('auth/login', {
    path: '/login', 
    pageTitle: 'Log in',
    errorMessage: errorMessage,
    successMessage: successMessage
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
        console.log(req.flash('error'));
        req.flash('error', 'Sähköposti on jo olemassa, valitse toinen.');
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
          req.flash('success', 'Tillisi on luonut onnistuisesti.');
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
        req.flash('error', 'Virheellinen sähköpostiosoite tai salasana!');
        return res.redirect('/login');
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
          req.flash('error', 'Invalid email or password!');
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