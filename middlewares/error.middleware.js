const ApiError = require('../utils/error.util');
const errorHandler = (err, req, res) => {
  let error = err;

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value (${field}: ${err.keyValue[field]})`;
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = new ApiError(400, `Validation error: ${messages.join(', ')}`);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }

  // Send response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      ...(error.errors && {errors: error.errors}),
    }),
  });
};

const notFound = (req, res, next) => {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
};

module.exports = {notFound, errorHandler}