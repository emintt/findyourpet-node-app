const path = require('path');

const express = require('express');

const postsController = require('../controllers/post');
const webController = require('../controllers/web');

const router = express.Router();

router.get('/', webController.getIndex);

router.get('/post-detail');
router.get('/saved-posts-delete-item', webController.postSavedPostsDeleteItem); 

module.exports = router;