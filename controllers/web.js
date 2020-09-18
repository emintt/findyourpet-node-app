const Post = require('../models/post');
const PetGender = require('../models/petGender');
const PetType = require('../models/petType');
const PostType = require('../models/postType');
const PostcodeArea = require('../models/postcodeArea');
const Image = require('../models/image');
const Member = require('../models/member');
const sequelize = require('../util/database');

// GET request for index page (home page)
exports.getIndex = (req, res, next) => {
  // fetch all posts and needed attributes from others tables
  Post.findAll({
    include: [
      {model: PostType, attributes: ['name']},
      {model: PetType, attributes: ['name']},
      {model: PetGender, attributes: ['name']},
      {model: PostcodeArea, attributes: ['name', 'cityName']},
      {model: Image, attributes: ['imageUrl']} // this returns images not image (1 post -> n imgs)
    ],
    order: [['createdAt', 'DESC']]
  },)
    .then( posts => {
      console.log(JSON.stringify(posts[0]));
      res.render('web/index', { 
        posts: posts,
        pageTitle: 'Find Your Pet',
        path: '/'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// for route get posts/:postId
exports.getPost = (req, res, next) => {
  // extract dynamic segment (:postId) from req.params object
  const postId = req.params.postId;
  Post.findByPk(postId, {
    attributes: { 
      // include an formated date attribute to display in view
      include: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('post.created_at'), '%d/%m/%Y'), 'createdAt'], 
        // [sequelize.fn('DATE_FORMAT', sequelize.col('post.pet_date'), '%d.%m.%Y'), 'petDate']
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
        pageTitle: 'Post Detail'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

// DOING
// POST request for search post form
exports.postSearchPosts = (req, res, next) => {
  // get all user input from incoming request
  const postcode = req.body.postcode;
  const postTypeId = req.body.postTypeId;
  const petTypeId = req.body.petTypeId;
  const petGenderId = req.body.petGenderId;
  let whereCondition = {};
  // push user inputs to whereCondition object if user chose or typed any option or postcode on search form
  // if user didn't choose or type one option, then this option will not be in whereCondition
  if (postcode) {
    whereCondition.postcode = postcode;
  }
  if (postTypeId) {
    whereCondition.postTypeId = postTypeId;
  }
  if (petTypeId) {
    whereCondition.petTypeId = petTypeId;
  }
  if (petGenderId) {
    whereCondition.petGenderId = petGenderId;
  }  

  Post.findAll({
    include: [
      {model: PostType, attributes: ['name']},
      {model: PetType, attributes: ['name']},
      {model: PetGender, attributes: ['name']},
      {model: PostcodeArea, attributes: ['name', 'cityName']},
      {model: Image, attributes: ['imageUrl']} // this returns images not image (1 post -> n imgs)
    ],
    // search posts where options are the chosen options
    where: whereCondition
  })
    .then( posts => {
      console.log(JSON.stringify(posts[0]));
      res.render('web/index', { 
        posts: posts,
        pageTitle: 'Find Your Pet',
        path: '/'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

// GET request for /privacy-policy page
exports.getPrivacyPolicy = (req, res, next) => {
  res.render('web/privacy-policy', { 
    pageTitle: 'Privacy Policy'
  });
}

