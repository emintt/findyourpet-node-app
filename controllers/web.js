const Post = require('../models/post');
const PetGender = require('../models/petGender');
const PetType = require('../models/petType');
const PostType = require('../models/postType');
const PostcodeArea = require('../models/postcodeArea');
const Image = require('../models/image');
const Member = require('../models/member');
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
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {console.log(err)});
};

// for route get posts/:postId
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findByPk(postId, {
    attributes: { 
      include: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('post.created_at'), '%d.%m.%Y'), 'createdAt'], 
        [sequelize.fn('DATE_FORMAT', sequelize.col('post.pet_date'), '%d.%m.%Y'), 'petDate']
      ]},
    include: [
      {model: PostType, attributes: ['name']},
      {model: PetType, attributes: ['name']},
      {model: PetGender, attributes: ['name']},
      {model: PostcodeArea, attributes: ['name', 'cityName']},
      {model: Image, attributes: ['imageUrl']},
      {model: Member, attributes: ['name']}
    ] 
  })
    .then((post) => {
      console.log(JSON.stringify(post));
      res.render('web/post-detail', {
        post: post,
        pageTitle: 'Post Detail',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
}

