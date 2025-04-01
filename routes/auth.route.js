const express = require('express');
const router = express.Router();
const {register, login, logout, refreshToken} = require(
    '../controllers/auth.controller');
const {register: registerValidation, login: loginValidation} = require(
    '../validations/user.validation');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});

router.route('/register').post(validator.body(registerValidation), register);
router.route('/login').post(validator.body(loginValidation), login);
router.route('/logout').get(logout);
router.route('/refresh-token').get(refreshToken);

module.exports = router;