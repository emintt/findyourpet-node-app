const moment = require('moment');
const { validationResult } = require('express-validator');

const Post = require('../models/post');
const PetType = require('../models/petType');
const PostType = require('../models/postType');
const PetGender = require('../models/petGender');
const City = require('../models/city');
const PostcodeArea = require('../models/postcodeArea');
const Image = require('../models/image');
const Member = require('../models/member');


const sequelize = require('../util/database');
// delete file helper
const fileHelper = require('../util/file');

// controller of /admin/add-post Get method
exports.getAddPost = (req, res, next) => {
  const postTypes = PostType.findAll();
  const petTypes = PetType.findAll();
  const petGenders = PetGender.findAll();
  const cities = City.findAll({
    order: [['name', 'ASC']]
  });
  // Destructuring promise, that take an array of promises
  Promise.all([postTypes, petTypes, petGenders, cities])
    .then(([postTypes, petTypes, petGenders, cities]) => {
      console.log(JSON.stringify(petGenders));
      res.render('admin/edit-post', {
        pageTitle: 'Add post',
        editing: false,
        postTypes: postTypes,
        petTypes: petTypes,
        petGenders: petGenders,
        cities: cities,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
} 

// POST request from /admin/add-post
exports.postAddPost = (req, res, next) => {
  // get all the user inputs from incoming request (by its 'name' attribute on view)
  const title = req.body.title;
  const content = req.body.content;
  const inputPetDateString = req.body.petDate;
  const petColor = req.body.petColor;
  const petGenderId = req.body.petGenderId;
  const cityName = req.body.cityId;
  const postcode = req.body.postcode; 
  const postTypeId = req.body.postTypeId;
  const petTypeId = req.body.petTypeId;

  const image = req.file;   
  // use moment to parse date and format it to save to database
  const petDate = moment.utc(inputPetDateString, "DD/MM/YYYY").format("YYYY-MM-DD");
  
  // collect all errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(image);
    console.log(errors.array());
    const postTypes = PostType.findAll();
    const petTypes = PetType.findAll();
    const petGenders = PetGender.findAll();
    const cities = City.findAll({
      order: [['name', 'ASC']]
    });
    // return to stop node to process more
    return Promise.all([postTypes, petTypes, petGenders, cities])
      .then(([postTypes, petTypes, petGenders, cities]) => {
        
        return res.status(422).render('admin/edit-post', {
          pageTitle: 'Add post',
          editing: false, 
          hasError: true,
          postTypes: postTypes,
          petTypes: petTypes,
          petGenders: petGenders,
          cities: cities,
          // pass all user inputs to view 
          post: {
            title: title,
            content: content,
            petDate: inputPetDateString,
            petColor: petColor,
            petGenderId: petGenderId,
            postcode: postcode,
            postcodeArea: {cityName: cityName},
            postTypeId: postTypeId, 
            petTypeId: petTypeId,
            //imageName: image.originalname 
            //images: [{imageUrl: imageUrl}]
          },
          errorMessage: errors.array()[0].msg,
          validationErrors: []
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  // if an image is not set, multer may declined the incoming file
  if (!image) {
    // load all needed data to send to view
    const postTypes = PostType.findAll();
    const petTypes = PetType.findAll();
    const petGenders = PetGender.findAll();
    const cities = City.findAll({
      order: [['name', 'ASC']]
    });
    return Promise.all([postTypes, petTypes, petGenders, cities])
      .then(([postTypes, petTypes, petGenders, cities]) => {
        
        return res.status(422).render('admin/edit-post', {
          pageTitle: 'Add post',
          editing: false,
          hasError: true,
          postTypes: postTypes,
          petTypes: petTypes,
          petGenders: petGenders,
          cities: cities,
          post: {
            title: title,
            content: content,
            petDate: inputPetDateString,
            petColor: petColor,
            petGenderId: petGenderId,
            postcode: postcode,
            postcodeArea: {cityName: cityName},
            postTypeId: postTypeId,
            petTypeId: petTypeId
            //images: [{imageUrl: imageUrl}]
          },
          errorMessage: 'Valitse .png, .jpeg . tai .jpg tyyppi kuva.',
          validationErrors: []
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  // now we sure that we had an image
  // get the path of image to save to database
  const imageUrl = image.path;
  //console.log(req.session.member instanceof Member); -> false
  // to create post is a short cut of build + save
  Post.create({
      title: title,
      content: content,
      petDate: petDate,
      petColor: petColor,
      petGenderId: petGenderId,
      postcode: postcode,
      postTypeId: postTypeId,
      petTypeId: petTypeId,
      memberId: req.session.member.id
    })
    .then(post => {
      console.log('Post Created');
      post.createImage({
        imageUrl: imageUrl,
        postId: post.id
      })
    })
    .then(result => {
      res.redirect('/admin/posts');
    })
    .catch(err => {
      const error = new Error(err);
      console.log(error);

      error.httpStatusCode = 500;
      return next(error);
    });
}

// GET request to /admin/edit-post
exports.getEditPost = (req, res, next) => {
  const editMode = req.query.edit; //in url will be admin/edit-post?edit=true
  if (!editMode) {
    return res.redirect('/');
  }
  // fetch Post data by id
  const postId = req.params.postId;
  const post = Post.findByPk(postId, {
    include: [
      {model: PostType, attributes: ['name']},
      {model: PetType, attributes: ['name']},
      {model: PetGender, attributes: ['name']},
      {model: PostcodeArea, attributes: ['name', 'cityName']},
      {model: Image, attributes: ['imageUrl']}
    ]
  });
  // fetch all needed data from database
  const postTypes = PostType.findAll();
  const petTypes = PetType.findAll();
  const petGenders = PetGender.findAll();
  const cities = City.findAll({
    order: [['name', 'ASC']]
  });
  // get all promises in an array
  Promise.all([post, postTypes, petTypes, petGenders, cities])
    .then(([post, postTypes, petTypes, petGenders, cities]) => {
      if (!post) {
        return res.redirect('/');
      }
      console.log(JSON.stringify(petTypes));
      console.log(JSON.stringify(post));
      console.log(JSON.stringify(postTypes));
      console.log(JSON.stringify(petGenders));
      res.render('admin/edit-post', {
        pageTitle: 'Edit Post',
        editing: editMode, 
        hasError: false,
        // pass the post data we just fetched to the view.
        post: post,
        postTypes: postTypes,
        petTypes: petTypes,
        petGenders: petGenders,
        cities: cities,
        errorMessage: null,
        validationErrors: []
      });
    })
    
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

// POST request for /admin/edit-post page
exports.postEditPost = (req, res, next) => {
  // store all user input from incoming request
  const postId = req.body.postId;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  const inputPetDateString = req.body.petDate;
  const updatedpetColor = req.body.petColor;
  const updatedPetGenderId = req.body.petGenderId;
  const updatedPostcode = req.body.postcode;
  const updatedPostTypeId = req.body.postTypeId;
  const updatedPetTypeId = req.body.petTypeId;

  const updatedCityName = req.body.cityId;
  const image = req.file;
  // parse date from input and format to store to database
  const updatedPetDate = moment.utc(inputPetDateString, "DD/MM/YYYY").format("YYYY-MM-DD");
  // collect all errors of express-validator
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    console.log(errors.array());
    const postTypes = PostType.findAll();
    const petTypes = PetType.findAll();
    const petGenders = PetGender.findAll();
    const cities = City.findAll({
      order: [['name', 'ASC']]
    });
    return Promise.all([postTypes, petTypes, petGenders, cities])
      .then(([postTypes, petTypes, petGenders, cities]) => {
        // render edit-post again with all needed data and display old user inputs data
        return res.status(422).render('admin/edit-post', {
          pageTitle: 'Edit post',
          editing: true,
          hasError: true,
          postTypes: postTypes,
          petTypes: petTypes,
          petGenders: petGenders,
          cities: cities,
          // pass the post data which include all user input data to the view.
          post: {
            title: updatedTitle,
            content: updatedContent,
            petDate: inputPetDateString,
            petColor: updatedpetColor,
            petGenderId: updatedPetGenderId,
            postcode: updatedPostcode,
            postcodeArea: {cityName: updatedCityName},
            postTypeId: updatedPostTypeId,
            petTypeId: updatedPetTypeId,
            //images: [{imageUrl: updatedImageUrl}],
            
            id: postId
          },
          errorMessage: errors.array()[0].msg,
          // pull out array of error from express-validator to view
          validationErrors: errors.array()
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  Post.findByPk(postId)
    .then(post => {
      console.log(JSON.stringify(post));
      post.title = updatedTitle;
      post.content = updatedContent;
      post.petDate = updatedPetDate;
      post.petColor = updatedpetColor;
      post.petGenderId = updatedPetGenderId;
      post.postcode = updatedPostcode;
      post.postTypeId = updatedPostTypeId;
      post.petTypeId = updatedPetTypeId;
      
      if (image) {
        post.getImages()
          .then(images => {
            fileHelper.deleteFile(images[0].imageUrl);
          })
          .catch(err => next(err));
        Image.update(
          {imageUrl: image.path }, 
          {where: {postId: postId } 
        });
      }
      return post.save();
    })
    .then(result => {
      console.log('UPDATED POST');
      res.redirect('/admin/posts');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
} 

// GET request for /admin/posts page (omat ilmoitukset)
exports.getPosts = (req, res, next) => {
  // find all posts of specific member
  Post.findAll({
    where: {memberId: req.session.member.id},
    // include one new attribute as a fomartted createdAt to display on view
    attributes: { 
      include: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('post.created_at'), '%d.%m.%Y'), 'createdAt'], 
        // [sequelize.fn('DATE_FORMAT', sequelize.col('post.pet_date'), '%d.%m.%Y'), 'petDate']
      ]
    },
    order: [['createdAt', 'desc']],
    // get name attributes of related table to display 
    include: [
      {model: PostType, attributes: ['name']},
      {model: PetType, attributes: ['name']},
      {model: PetGender, attributes: ['name']},
      {model: PostcodeArea, attributes: ['name', 'cityName']},
      {model: Image, attributes: ['imageUrl']} // this returns images not image (1 post -> n imgs)
    ]
  })
    .then((posts) => {
      res.render('admin/posts', {
        posts: posts, 
        pageTitle: 'Posts',
        path: '/posts'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

// POST request from /admin/delete-post form on admin/posts view
exports.postDeletePost = (req, res, next) => {
  // get postId from incoming request
  const postId = req.body.postId;
  console.log(postId);
  Post.findByPk(postId)
    .then(post => {
      if (!post) {
        return next(new Error('Post not found'));
      }
      post.getImages()
        .then(images => {
          fileHelper.deleteFile(images[0].imageUrl);
        })
        .catch(err => next(err));
      return post.destroy();
    })
    .then(result => {
      console.log('DESTROYED POST');
      res.redirect('/admin/posts');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}





// exports.getSavedPosts = (req, res, next) => {
//   SavedPosts.getSavedPosts(savedPosts => {
//     Post.findAll(posts => {
//       const savedPostsData = [];
//       for (post of posts) {
//         if (savedPosts.posts.find(p => p.id === post.id)) {
//           savedPostsData.push({postData: post});
//         } 
//       }
//       res.render('admin/saved-posts', {
//         pageTitle: 'Ilmoitusvahdit',
//         path: '/saved-posts',
//         posts: savedPostsData
//       });
//     });
//   });
// }

// exports.postSavedPosts = (req, res, next) => {
//   const postId = req.body.postId;
//   Post.findById(postId, (post) => {
//     SavedPosts.addPost(postId);
//   });
//   console.log(postId);
//   res.redirect('/');
// }

// exports.getPostList = (req, res, next) => {
//   Post.fetchAll(posts => {
//     res.render('admin/post-list', {
//       posts: posts, 
//       pageTitle: 'Omat ilmoitukset',
//       path: '/post-list'
//     });
//   });
// }

