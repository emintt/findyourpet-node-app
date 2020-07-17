const path = require('path');

const express = require('express');

const postsController = require('../controllers/post');
const profileController = require('../controllers/profile');
const messageController = require('../controllers/message');

const router = express.Router();

// /admin/add-post => GET
router.get('/add-post', postsController.getAddPost);
router.post('/add-post', postsController.postAddPost);
router.get('/edit-post/:postId', postsController.getEditPost);
router.post('/edit-post', postsController.postEditPost);
router.get('/waiting-posts', postsController.getWaitingPosts);
router.get('/waiting-posts/:postId', postsController.getPost);
router.get('/saved-posts', postsController.getSavedPosts);
router.post('/saved-posts', postsController.postSavedPosts); 
router.post('/delete-post'), postsController.postDeletePost;

router.get('/profile', profileController.getProfile);
router.get('/message', messageController.getMessage);
router.get('/post-list', postsController.getPostList);






module.exports = router;
