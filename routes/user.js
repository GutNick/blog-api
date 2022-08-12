const router = require('express').Router();
const {
  getUser, updateUser, deleteUser, getUsers,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/:id', getUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
