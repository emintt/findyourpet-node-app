exports.getProfile = (req, res, next) => {
  res.render('admin/profile', {pageTitle: 'Tili'});
}