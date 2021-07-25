const Joi = require("@hapi/joi");

const postSizeValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().trim().min(6).max(255).required(),
    size: Joi.string().trim().min(1).max(255).required(),
  });
  return schema.validate(data);
};

const putSizeValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
    size: Joi.string().trim().min(1).max(255).required(),
  });
  return schema.validate(data);
};

module.exports.postSizeValidation = postSizeValidation;
module.exports.putSizeValidation = putSizeValidation;
