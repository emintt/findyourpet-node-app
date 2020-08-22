
// if user is not auth, return response redirect and never call next 
// => the next middleware inline cann't be reach
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
}