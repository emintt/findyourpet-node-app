const Member = require('../models/member');

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  })
}

exports.postLogin = (req, res, next) => {
  // asume the user logged in for now
  Member.findByPk(1)
    .then(member => {
      req.session.member = member;
      req.session.isLoggedIn = true;
      res.redirect('/');
    })
    .catch(err => {console.log(err)});
}