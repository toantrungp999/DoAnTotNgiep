const Joi = require("@hapi/joi");

const postProductValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(500).required(),
    brandId: Joi.string().trim().min(6).max(255).required(),
    categoryId: Joi.string().trim().min(6).max(255).required(),
    orgin: Joi.string().trim().min(1).max(255).required(),
    material: Joi.string().trim().min(1).max(255).required(),
    description: Joi.string().trim().min(1).max(500).required(),
    price: Joi.number().integer().min(1).max(9999999999).required(),
    saleOff: Joi.number().integer().min(0).max(9999999999).required(),
    images: Joi.array().min(1).required(),
    review: Joi.string().allow(null).allow("").max(20000).required(),
  });
  return schema.validate(data);
};

const putProductValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
    name: Joi.string().trim().min(3).max(500).required(),
    brandId: Joi.string().trim().min(6).max(255).required(),
    categoryId: Joi.string().trim().min(6).max(255).required(),
    orgin: Joi.string().trim().min(1).max(255).required(),
    material: Joi.string().trim().min(1).max(255).required(),
    description: Joi.string().trim().min(1).max(500).required(),
    price: Joi.number().integer().min(1).max(9999999999).required(),
    saleOff: Joi.number().integer().min(0).max(9999999999).required(),
    images: Joi.array().min(1).required(),
    review: Joi.string().allow(null).allow("").max(20000).required(),
    status: Joi.boolean().required(),
  });
  return schema.validate(data);
};
module.exports.postProductValidation = postProductValidation;
module.exports.putProductValidation = putProductValidation;
