const { celebrate, Joi } = require('celebrate');

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    about: Joi.string(),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    about: Joi.string(),
  }),
});

module.exports.validateCreatePost = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2),
    image: Joi.string().regex(/[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/),
    content: Joi.string().required(),
    creator: Joi.string().hex().length(24),
  }),
});

module.exports.validateDeletePost = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});
