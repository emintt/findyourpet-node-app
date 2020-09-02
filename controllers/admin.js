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
const fileHelper = require('../util/file');


exports.getAddPost = (req, res, next) => {
  const postTypes = PostType.findAll();
  const petTypes = PetType.findAll();
  const petGenders = PetGender.findAll();
  const cities = City.findAll({
    order: [['name', 'ASC']]
  });
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

exports.postAddPost = (req, res, next) => {
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
  const petDate = moment.utc(inputPetDateString, "DD/MM/YYYY").format("YYYY-MM-DD");
  
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
            petTypeId: petTypeId,
            imageName: image.originalname
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
  if (!image) {
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

exports.getEditPost = (req, res, next) => {
  const editMode = req.query.edit; //in url admin/edit-post?edit=true
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
  const postTypes = PostType.findAll();
  const petTypes = PetType.findAll();
  const petGenders = PetGender.findAll();
  const cities = City.findAll({
    order: [['name', 'ASC']]
  });
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
exports.postEditPost = (req, res, next) => {
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
  const updatedPetDate = moment.utc(inputPetDateString, "DD/MM/YYYY").format("YYYY-MM-DD");
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
        
        return res.status(422).render('admin/edit-post', {
          pageTitle: 'Edit post',
          editing: true,
          hasError: true,
          postTypes: postTypes,
          petTypes: petTypes,
          petGenders: petGenders,
          cities: cities,
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

exports.getPosts = (req, res, next) => {
  Post.findAll({
    where: {memberId: req.session.member.id},
    attributes: { 
      include: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('post.created_at'), '%d.%m.%Y'), 'createdAt'], 
        // [sequelize.fn('DATE_FORMAT', sequelize.col('post.pet_date'), '%d.%m.%Y'), 'petDate']
      ]
    },
    order: [['createdAt', 'desc']],
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

exports.postDeletePost = (req, res, next) => {
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

