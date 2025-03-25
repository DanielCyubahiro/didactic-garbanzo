const express = require('express');
const {getUsers, createUser, getUserById, updateUser, deleteUser} = require(
    '../controllers/usersController');
const router = express.Router();

router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
