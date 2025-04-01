const ApiError = require('../utils/error.util');

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @description Handles all errors thrown in the application and sends appropriate responses
 */
const errorHandler = (err, req, res) => {
  let error = err;

  // Handle Mongoose CastError (invalid ObjectId format)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(404, message);
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value (${field}: ${err.keyValue[field]})`;
    error = new ApiError(400, message);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = new ApiError(400, `Validation error: ${messages.join(', ')}`);
  }

  // Handle JWT authentication errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }

  // Handle expired JWT tokens
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }

  // Handle Joi validation errors
  if (err?.error?.isJoi) {
    const messages = err.error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/['"]/g, '')
    }));
    error = new ApiError(400, 'Validation failed', messages);
  }

  /**
   * Send error response to client
   * - In production: Only sends error message
   * - In development: Includes stack trace and validation errors
   */
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      ...(error.errors && {errors: error.errors}),
    }),
  });
};

/**
 * 404 Not Found handler middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @description Catches unmatched routes and forwards to error handler
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
};

module.exports = {notFound, errorHandler};