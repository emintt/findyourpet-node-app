exports.getDashboard = (req, res, next) => {
  res.render('account/dashboard', { pageTitle: 'Käyttäjätili' });
}