const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => await bcrypt.hash(password, 10);
const comparePassword = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword);
const generateAccessToken = async (user) => jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES});
const generateRefreshToken = async (user) => jwt.sign({id: user.id}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRES});

module.exports = {hashPassword, comparePassword, generateAccessToken, generateRefreshToken};