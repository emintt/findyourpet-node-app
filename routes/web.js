const path = require('path');

const express = require('express');

const webController = require('../controllers/web');

const router = express.Router();

router.get('/', webController.getIndex);
// post-detail
router.get('/posts/:postId', webController.getPost);
router.post('/search-posts', webController.postSearchPosts);
router.get('/privacy-policy', webController.getPrivacyPolicy);


module.exports = router;