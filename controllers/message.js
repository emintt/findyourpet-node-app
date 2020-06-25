exports.getMessage = (req, res, next) => {
  res.render('admin/message', { pageTitle: 'Viestit' });
}