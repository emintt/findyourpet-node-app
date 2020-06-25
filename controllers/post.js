const Post = require('../models/post');

exports.getAddPost = (req, res, next) => {
  res.render('admin/add-post', {pageTitle: 'Add post'});
}

exports.postAddPost = (req, res, next) => {
  const title = req.body.title;
  const postText = req.body.postText;
  const postType = req.body.postType;
  const petDate = req.body.petDate;
  const gender = req.body.gender;
  const owner = req.body.owner;
  const area = req.body.area;
  const city = req.body.city;
  const postDate = req.body.postDate;
  const post = new Post(title, postText, postType, petDate, gender, owner, area, city, postDate);
  post.save();
  res.redirect('admin/waiting-posts');
}

exports.getWaitingPosts = (req, res, next) => {
  Post.fetchAll(posts => {
    res.render('admin/waiting-posts', {
      posts: posts, 
      pageTitle: 'Posts'
    });
  });
}

exports.getPostList = (req, res, next) => {
  Post.fetchAll(posts => {
    res.render('admin/post-list', {
      posts: posts, 
      pageTitle: 'Omat ilmoitukset'
    });
  });
}