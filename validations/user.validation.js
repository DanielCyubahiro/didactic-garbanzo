const Joi = require('joi');

module.exports = {
  register: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    roles: Joi.object().optional(),
  }),

  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().alphanum().required(),
  }),

};