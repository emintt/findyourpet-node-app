const path = require('path');

const express = require('express');

const postsController = require('../controllers/post');
const profileController = require('../controllers/profile');
const messageController = require('../controllers/message');

const router = express.Router();

// /admin/add-post => GET
router.get('/add-post', postsController.getAddPost);
router.post('/add-post', postsController.postAddPost);
// /admin/posts => GET
router.get('/waiting-posts', postsController.getWaitingPosts);
router.get('/profile', profileController.getProfile);
router.get('/message', messageController.getMessage);
router.get('/post-list', postsController.getPostList);





module.exports = router;
