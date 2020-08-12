const Post = require('../models/post');
const PetGender = require('../models/petGender');
const PetType = require('../models/petType');
const PostType = require('../models/postType');
const PostcodeArea = require('../models/postcodeArea');
const Image = require('../models/image');
const SavedPosts = require('../models/saved-posts');
const sequelize = require('../util/database');

exports.getIndex = (req, res, next) => {
  Post.findAll({
    attributes: { 
      include: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('post.pet_date'), '%d.%m.%Y'), 'petDate']
      ]},
    include: [
      {model: PostType, attributes: ['name']},
      {model: PetType, attributes: ['name']},
      {model: PetGender, attributes: ['name']},
      {model: PostcodeArea, attributes: ['name', 'cityName']},
      {model: Image, attributes: ['imageUrl']} // this returns images not image (1 post -> n imgs)
    ]
  })
    .then( posts => {
      console.log(JSON.stringify(posts[0]));
      res.render('web/index', { 
        posts: posts,
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