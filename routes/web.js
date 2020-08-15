const path = require('path');

const express = require('express');

const webController = require('../controllers/web');

const router = express.Router();

router.get('/', webController.getIndex);
// post detail
router.get('/posts/:postId', webController.getPost);


module.exports = router;