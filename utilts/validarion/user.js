const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  bio: Joi.string().allow(""),
  role: Joi.string().valid("user", "admin").optional(),
  photo: Joi.string().optional(),
});

const updateUserPutSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  bio: Joi.string().allow(""),
  role: Joi.string().valid("user", "admin").required(),
  photo: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  bio: Joi.string().allow(""),
  role: Joi.string().valid("user", "admin"),
  photo: Joi.string(),
}).min(1);

module.exports = {
  createUserSchema,
  updateUserPutSchema,
  updateUserSchema,
};
