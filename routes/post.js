const router = require('express').Router();
const {
  createPost, getPost, updatePost, deletePost, getPosts,
} = require('../controllers/post');

router.post('/', createPost);

router.get('/', getPosts);

router.get('/:id', getPost);

router.patch('/:id', updatePost);

router.delete('/:id', deletePost);

module.exports = router;
