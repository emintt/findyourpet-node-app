const Post = require('../models/post');

exports.getIndex = (req, res, next) => {
  Post.fetchAll(posts => {
    res.render('web/index', {
      posts: posts,
      pageTitle: 'Find Your Pet',
      path: '/'
    });
  });
};