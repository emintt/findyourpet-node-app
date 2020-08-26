const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');


const Member = require('../models/member');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
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
    validationErrors: []
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
    successMessage: successMessage,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  })
}

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
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

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  let successMessage = req.flash('success');
  successMessage = successMessage.length > 0 ? successMessage[0] : null;
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
      return next(error);
    });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}

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