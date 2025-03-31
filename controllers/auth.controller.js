const {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const ROLES = require('../config/roles');
const User = require('../models/user.model');

const register = async (req, res) => {
  const {username, password, roles} = req.body;
  if (!username || !password) {
    return res.status(400).
        json({'Message': 'Username and Password are both required'});
  }

  //Check if user is already registered
  const user = await User.findOne({username: username}).exec();
  if (user) {
    return res.status(409).json({'Message': 'Username already registered'});
  }

  //Create new user
  try {
    const hashedPassword = await hashPassword(password);
    const result = await User.insertOne({
      id: Date.now().toString(),
      username: username,
      password: hashedPassword,
      roles: {...roles, 'User': ROLES.User},
    });
    return res.status(201).
        json({'Message': 'Successfully registered', 'User': result});
  } catch (error) {
    console.log(error);
    return res.status(500).json({'Message': error.message});
  }
};

const login = async (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).
        json({'Message': 'Username and Password are both required'});
  }
  const currentUser = await User.findOne({username: username});
  if (currentUser) {
    const match = await comparePassword(password, currentUser.password);
    if (match) {
      const accessToken = generateAccessToken(currentUser);
      const refreshToken = generateRefreshToken(currentUser);

      currentUser.refreshToken = refreshToken;
      await currentUser.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.JWT_SECURE === 'true',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).
          json({
            'Message': 'Successfully logged in',
            'AccessToken': accessToken,
          });
    } else {
      return res.status(401).json({'Message': 'Invalid username or password'});
    }
  } else {
    return res.status(401).json({'Message': 'Invalid username or password'});
  }
};

const logout = async (req, res) => {
  //Check if refresh token exists in the cookies
  if (!req.cookies.refreshToken) return res.sendStatus(204);

  //Check if refresh token exists in the DB
  const currentUser = await User.findOne(
      {refreshToken: req.cookies.refreshToken});
  if (!currentUser) {
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  }

  //Delete token from user in the DB
  currentUser.refreshToken = null;
  await currentUser.save();

  //Clear cookie
  res.clearCookie('refreshToken');
  return res.status(204).json({'Message': 'Successfully logged out'});
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({'Message': 'No refresh token provided'});
  }

  //Check if there's a user with the refresh token
  const currentUser = await User.findOne({refreshToken});
  if (!currentUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err || currentUser.username === decoded.username) {
      return res.sendStatus(403);
    }
    const newAccessToken = generateAccessToken(currentUser);
    return res.status(200).json({'AccessToken': newAccessToken});
  });

};

module.exports = {register, login, logout, refreshToken};