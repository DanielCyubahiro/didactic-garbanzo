const express = require('express');
const router = express.Router();
const {register, login, logout, refreshToken} = require('../controllers/auth.controller');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/refresh-token').get(refreshToken);

module.exports = router;