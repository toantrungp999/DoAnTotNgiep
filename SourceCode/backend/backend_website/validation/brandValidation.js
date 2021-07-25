const Joi = require("@hapi/joi");

const postBrandValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(500).required(),
    description: Joi.string().allow(null).allow("").max(1000),
  });
  return schema.validate(data);
};

const putBrandValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
    name: Joi.string().trim().min(3).max(500).required(),
    description: Joi.string().allow(null).allow("").max(1000),
    status: Joi.boolean().required(),
  });
  return schema.validate(data);
};

module.exports.postBrandValidation = postBrandValidation;
module.exports.putBrandValidation = putBrandValidation;
