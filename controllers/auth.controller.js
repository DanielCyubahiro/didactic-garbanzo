const {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const ROLES = require('../config/roles');
const User = require('../models/user.model');
const ApiError = require('../utils/error.util');

const register = async (req, res, next) => {
  try {
    const {username, password, roles} = req.body;

    // Validation
    if (!username || !password) {
      return next(new ApiError(400, 'Username and password are required'));
    }

    // Check for existing user
    const existingUser = await User.findOne({username}).exec();
    if (existingUser) {
      return next(new ApiError(409, 'Username already registered'));
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      roles: {...roles, User: ROLES.User}, // Ensure default role
    });

    // Return response (avoid including password hash)
    const {password: _, ...userData} = newUser.toObject();
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: process.env.ENVIRONMENT === 'development' ? newUser : userData,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const {username, password} = req.body;

    // Validation
    if (!username || !password) {
      return next(new ApiError(400, 'Both username and password are required'));
    }

    // Constant-time user check
    const userExists = await User.exists({username});
    if (!userExists) {
      await comparePassword(password, '$2a$10$dummyhashdummyhashdummyhash');
      return next(new ApiError(401, 'Invalid credentials'));
    }

    // Get user and compare passwords
    const currentUser = await User.findOne({username});
    const match = await comparePassword(password, currentUser.password);
    if (!match) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    // Token generation
    let accessToken, refreshToken;
    try {
      accessToken = generateAccessToken(currentUser);
      refreshToken = generateRefreshToken(currentUser);
    } catch (tokenError) {
      return next(new ApiError(500, 'Authentication system error'));
    }

    // Update user session
    currentUser.refreshToken = refreshToken;
    currentUser.lastLogin = new Date();
    await currentUser.save();

    // Set cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.ENVIRONMENT === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Response
    const response = {
      success: true,
      message: 'Login successful',
      ...(process.env.ENVIRONMENT === 'development' && {accessToken: accessToken}),
    };

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Check cookies
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    // Check database
    const currentUser = await User.findOne({refreshToken});
    if (!currentUser) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.ENVIRONMENT === 'production',
      });
      return res.sendStatus(204);
    }

    // Invalidate token
    currentUser.refreshToken = null;
    await currentUser.save();

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.ENVIRONMENT === 'production',
    });

    return res.sendStatus(204);
  } catch (error) {
    return next(new ApiError(500, 'Logout failed'));
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new ApiError(401, 'Refresh token required'));
    }

    const currentUser = await User.findOne({refreshToken});
    if (!currentUser) {
      return next(new ApiError(403, 'Invalid refresh token'));
    }

    const decoded = await jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
    );

    if (currentUser.username !== decoded.username) {
      return next(new ApiError(403, 'Token mismatch'));
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(currentUser);
    const newRefreshToken = generateRefreshToken(currentUser);

    // Update user record with new refresh token
    currentUser.refreshToken = newRefreshToken;
    await currentUser.save();

    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.ENVIRONMENT === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    return next(error);
  }
};

module.exports = {register, login, logout, refreshToken};