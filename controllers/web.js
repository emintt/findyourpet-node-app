const Post = require('../models/post');
const SavedPosts = require('../models/saved-posts');

exports.getIndex = (req, res, next) => {
  Post.fetchAll()
    .then(([rows, fileData]) => {
      res.render('web/index', { 
        posts: rows,
        pageTitle: 'Find Your Pet',
        path: '/'
      });
    })
    .catch(err => {console.log(err)});
};

exports.postSavedPostsDeleteItem = (req, res, next) => {
  const postId = req.body.postId;
  Post.findById(postId, post => {
    SavedPosts.deletePost(postId);
    res.redirect('/admin/saved-posts');
  });
} 