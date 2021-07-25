const Joi = require("@hapi/joi");

const postCartValidation = (data) => {
  const schema = Joi.object({
    sizeId: Joi.string().trim().min(6).max(255).required(),
    colorId: Joi.string().trim().min(6).max(255).required(),
    quantity: Joi.number().integer().min(1).max(5).required(),
  });
  return schema.validate(data);
};

const putCartValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
    quantity: Joi.number().integer().min(1).max(5).required(),
  });
  return schema.validate(data);
};

const putUpdateTypeCartValidation = (data) => {
  const schema = Joi.object({
    cartId: Joi.string().trim().min(6).max(255).required(),
    sizeId: Joi.string().trim().min(6).max(255).required(),
    colorId: Joi.string().trim().min(6).max(255).required(),
    quantity: Joi.number().integer().min(1).max(5).required(),
  });
  return schema.validate(data);
};

const deleteCartValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

module.exports.postCartValidation = postCartValidation;
module.exports.putCartValidation = putCartValidation;
module.exports.putUpdateTypeCartValidation = putUpdateTypeCartValidation;
module.exports.deleteCartValidation = deleteCartValidation;
