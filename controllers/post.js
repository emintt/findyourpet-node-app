const Post = require('../models/post');
const SavedPosts = require('../models/saved-posts');


exports.getAddPost = (req, res, next) => {
  res.render('admin/edit-post', {
    pageTitle: 'Add post',
    editing: false
  });
} 

exports.postAddPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const petDate = req.body.petDate;
  const petColor = req.body.petColor;
  const gender = req.body.gender;
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
      gender: gender,
      postcode: postcode,
      postTypeId: postTypeId,
      petTypeId: petTypeId
    })
    .then(result => {
      console.log(result);
      console.log('Post Created');
      res.redirect('admin/waiting-posts');
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
  Post.findById(postId, post => {
    if (!post) {
      return res.redirect('/');
    }
    res.render('admin/edit-post', {
      pageTitle: 'Edit Post',
      editing: editMode, 
      // pass the post data we just fetched to the view.
      post: post 
    });
  });
}

exports.postEditPost = (req, res, next) => {
  const postId = req.body.postId;
  const updatedTitle = req.body.title;
  const updatedPostText = req.body.postText;
  const updatedPostType = req.body.postType;
  const updatedPetDate = req.body.perDate;
  const updatedSize = req.body.size;
  const updatedGender = req.body.gender;
  const updatedOwner = req.body.owner;
  const updatedPostcode = req.body.postcode;
  const updatedArea = req.body.area;
  const updatedCity = req.body.city;
  const updatedPostDate = req.body.postDate;
  const updatedPost = new Post(
    postId, 
    updatedTitle, 
    updatedPostText, 
    updatedPostType, 
    updatedPetDate,
    updatedSize,
    updatedGender, 
    updatedOwner,
    updatedPostcode,
    updatedArea,
    updatedCity,
    updatedPostDate
  );
  updatedPost.save();
  res.redirect('/admin/waiting-posts');
}

exports.getWaitingPosts = (req, res, next) => {
  Post.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('admin/waiting-posts', {
        posts: rows, 
        pageTitle: 'Posts',
        path: '/waiting-posts'
      });
    })
    .catch(err => console.log(err));
}
// for route get waiting-posts/:postid
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(([post]) => {
      console.log(post);
      res.render('web/post-detail', {
        post: post[0],
        pageTitle: 'Post Detail'
      });
    })
    .catch(err => console.log(err));
}



exports.getSavedPosts = (req, res, next) => {
  SavedPosts.getSavedPosts(savedPosts => {
    Post.fetchAll(posts => {
      const savedPostsData = [];
      for (post of posts) {
        if (savedPosts.posts.find(p => p.id === post.id)) {
          savedPostsData.push({postData: post});
        } 
      }
      res.render('admin/saved-posts', {
        pageTitle: 'Ilmoitusvahdit',
        path: '/saved-posts',
        posts: savedPostsData
      });
    });
  });
}

exports.postSavedPosts = (req, res, next) => {
  const postId = req.body.postId;
  Post.findById(postId, (post) => {
    SavedPosts.addPost(postId);
  });
  console.log(postId);
  res.redirect('/');
}

exports.getPostList = (req, res, next) => {
  Post.fetchAll(posts => {
    res.render('admin/post-list', {
      posts: posts, 
      pageTitle: 'Omat ilmoitukset',
      path: '/post-list'
    });
  });
}

exports.postDeletePost = (req, res, next) => {
  const postId = req.body.postId;
  Post.deleteById(postId);
  res.redirect('admin/waiting-posts');
}