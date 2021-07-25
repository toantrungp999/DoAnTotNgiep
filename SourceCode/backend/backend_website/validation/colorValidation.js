const Joi = require("@hapi/joi");

const postColorValidation = (data) => {
  console.log(data);
  const schema = Joi.object({
    productId: Joi.string().trim().min(6).max(255).required(),
    color: Joi.string().trim().min(2).max(255).required(),
    image: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const putColorValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
    color: Joi.string().trim().min(2).max(255).required(),
    image: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

module.exports.postColorValidation = postColorValidation;
module.exports.putColorValidation = putColorValidation;
