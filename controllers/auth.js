const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
 

const Member = require('../models/member');

// api key that created from sendgrid account to send mail
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

// GET request from /sign-up page (view/auth/signup)
exports.getSignup = (req, res, next) => {
  // get flash message of 'error' variable
  let message = req.flash('error');
  // set null if we don't have message and its first element if we have any
  message = message.length > 0 ? message[0] : null;

  res.render('auth/signup', {
    pageTitle: 'Sign up',
    errorMessage: message,
    oldInput: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      confirmPassword: ''
    },
    // there is no error of validation in this GET request
    validationErrors: []
  });
}

// GET request of /login page
exports.getLogin = (req, res, next) => {
  
  // message will come in an array
  // get flash message of 'error' variable
  let errorMessage = req.flash('error');
  // if we have any message, then take the first one, otherwise set null
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  // get flash message of 'success' variable
  let successMessage = req.flash('success');
  successMessage = successMessage.length > 0 ? successMessage[0] : null;

  res.render('auth/login', {
    path: '/login', 
    pageTitle: 'Log in',
    errorMessage: errorMessage,
    successMessage: successMessage,
    // send back data user has input to view, no old input in this page
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  })
}

// POST request from /sign-up form
exports.postSignup = (req, res, next) => {
  // get info from incoming request
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  // if validation error occur, render again signup page with old input of user
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      pageTitle: 'Sign up',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        password: password, 
        confirmPassword: confirmPassword
      },
      validationErrors: errors.array()
    });
  }
  // if no error, hash password string, 12 rounds
  bcrypt
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
      // send flash 'success' message 
      req.flash('success', 'Tillisi on luonut onnistuisesti.');
      res.redirect('/login');
      // return transporter.sendMail({
      //   to: result.email,
      //   from: 'thi.nguyen@edu.amiedu.fi',
      //   subject: 'Rekisteröinti onnistuisesti',
      //   html: '<h1>Olet onnistuneesti rekisteröintynyt!</h1>'
      // });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

// POST request of login form
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // get all errors from express-validator
  const errors = validationResult(req);
  let successMessage = req.flash('success');
  // check if successMessage is not an empty array, get its first element
  successMessage = (successMessage && successMessage.length > 0) ? successMessage[0] : null;
  // if validation occur, render /login page with old user input 
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/login', {
      path: '/login', 
      pageTitle: 'Log in',
      errorMessage: errors.array()[0].msg,
      successMessage: successMessage,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    })
  } 
  Member
    .findOne({where: {email: email}})
    .then(member => {
      if (!member) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Log in',
          errorMessage: 'Virheellinen sähköpostiosoite tai salasana!',
          successMessage: successMessage,
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        })
      }
      // pass password to bcrypt to compare
      bcrypt
        .compare(password, member.password)
        .then(result => {
          if (result) {
            // result === true means passwords are the same.
            // set save member and state to session if password matched
            req.session.member = member;
            req.session.isLoggedIn = true;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            })
          }
          // password does not matched, render login page with error messgae
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Log in',
            errorMessage: 'Virheellinen sähköpostiosoite tai salasana!',
            successMessage: successMessage,
            oldInput: {
            email: email,
            password: password
            },
            validationErrors: []
          })
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
      return error;
    });
}

// POST request from /logout form of /admin/posts view
exports.postLogout = (req, res, next) => {
  // destroy() take a function which will be called when session is destroyed
  // redirect to home page after destroy session
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}

// TO DO
// GET reset page. 
exports.getReset = (req, res, next) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('auth/reset', {
    path: '/reset', 
    pageTitle: 'Reset Password',
    errorMessage: errorMessage
  });
}