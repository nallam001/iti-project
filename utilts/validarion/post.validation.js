const Joi = require("joi");

const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).required(),
  userId: Joi.string().hex().length(24).required(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  content: Joi.string().min(10),
  userId: Joi.string().hex().length(24),
}).min(1);

module.exports = { createPostSchema, updatePostSchema };
