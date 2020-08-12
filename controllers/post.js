const Post = require('../models/post');
const PetType = require('../models/petType');
const PostType = require('../models/postType');
const PetGender = require('../models/petGender');
const City = require('../models/city');
const PostcodeArea = require('../models/postcodeArea');
const Image = require('../models/image');
const Member = require('../models/member');
const SavedPosts = require('../models/saved-posts');

const sequelize = require('../util/database');


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
        cities: cities
      });
    })
    .catch(err => {console.log(err)});
} 

exports.postAddPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const petDate = req.body.petDate;
  const petColor = req.body.petColor;
  const petGenderId = req.body.petGenderId;
  const postcode = req.body.postcode;
  const postTypeId = req.body.postTypeId;
  const petTypeId = req.body.petTypeId;
  const imageUrl = req.body.imageUrl;
  req.member
    .createPost({
      title: title,
      content: content,
      petDate: petDate,
      petColor: petColor,
      petGenderId: petGenderId,
      postcode: postcode,
      postTypeId: postTypeId,
      petTypeId: petTypeId 
    })
    .then(post => {
      console.log('Post Created');
      post.createImage({
        imageUrl: imageUrl,
        postId: post.id
      })
    })
    .then(result => {
      res.redirect('/admin/waiting-posts');
    })
    .catch(err => console.log(err));
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
        // pass the post data we just fetched to the view.
        post: post,
        postTypes: postTypes,
        petTypes: petTypes,
        petGenders: petGenders,
        cities: cities
      });
    })
    
    .catch(err => {console.log(err)});
}
exports.postEditPost = (req, res, next) => {
  const postId = req.body.postId;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  const updatedPetDate = req.body.petDate;
  const updatedpetColor = req.body.petColor;
  const updatedGender = req.body.gender;
  const updatedPostcode = req.body.postcode;
  const updatedPostTypeId = req.body.postTypeId;
  const updatedPetTypeId = req.body.petTypeId;
  const updatedImageUrl = req.body.imageUrl;
  Post.findByPk(postId)
    .then(post => {
      console.log(JSON.stringify(post));
      post.title = updatedTitle;
      post.content = updatedContent;
      post.petDate = updatedPetDate;
      post.petColor = updatedpetColor;
      post.gender = updatedGender;
      post.postcode = updatedPostcode;
      post.postTypeId = updatedPostTypeId;
      post.petTypeId = updatedPetTypeId;
      return post.save();
    }).
    then(post => {
      Image.update(
        {imageUrl: req.body.imageUrl}, 
        {where: {postId: post.id } 
      });
    })
    .then(result => {
      console.log('UPDATED POST');
      res.redirect('/admin/waiting-posts');
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getWaitingPosts = (req, res, next) => {
  Post.findAll({
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
      {model: Image, attributes: ['imageUrl']} // this returns images not image (1 post -> n imgs)
    ]
  })
    .then((posts) => {
      res.render('admin/waiting-posts', {
        posts: posts, 
        pageTitle: 'Posts',
        path: '/waiting-posts'
      });
    })
    .catch(err => console.log(err));
}

exports.postDeletePost = (req, res, next) => {
  const postId = req.body.postId;
  console.log(postId);
  Post.findByPk(postId)
    .then(post => {
      return post.destroy();
    })
    .then(result => {
      console.log('DESTROYED POST');
      res.redirect('/admin/waiting-posts');
    })
    .catch(err => {console.log(err)});
}

// for route get waiting-posts/:postId
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
        pageTitle: 'Post Detail'
      });
    })
    .catch(err => console.log(err));
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

