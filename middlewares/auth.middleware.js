const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token in authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Response|void} Returns error response if unauthorized or continues to next middleware
 */
const verifyJWT = (req, res, next) => {
  // Check for authorization header with Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({'Message': 'Access denied'});
  }

  // Extract token from header
  const token = authHeader.split(' ')[1];

  try {
    // Verify token and attach decoded user info to request object
    req.user = jwt.verify(token, process.env.JWT_SECRET).UserInfo;
    next();
  } catch (error) {
    // Pass any verification errors to error handler
    next(error);
  }
};

module.exports = verifyJWT;