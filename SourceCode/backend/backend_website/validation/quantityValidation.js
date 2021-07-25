const Joi = require("@hapi/joi");

const postQuantityValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().trim().min(6).max(255).required(),
    colorId: Joi.string().trim().min(6).max(255),
    sizeId: Joi.string().trim().min(6).max(255),
    quantity: Joi.number().integer().min(0).max(999).required(),
  });
  return schema.validate(data);
};

const putQuantityValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
    quantity: Joi.number().integer().min(0).max(999).required(),
  });
  return schema.validate(data);
};

module.exports.postQuantityValidation = postQuantityValidation;
module.exports.putQuantityValidation = putQuantityValidation;
