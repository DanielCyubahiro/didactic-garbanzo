const Joi = require('joi');

module.exports = {
  createEmployeeValidation: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    username: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(11).max(11).optional(),
    website: Joi.string().uri().allow('')
  }),

  updateEmployeeValidation: Joi.object({
    name: Joi.string().min(2).max(50),
    username: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string().min(11).max(11),
    website: Joi.string().uri().allow('')
  }).min(1),

  employeeIdValidation: Joi.object({
    id: Joi.string().hex().length(24).required() // For MongoDB ObjectId
  })
}