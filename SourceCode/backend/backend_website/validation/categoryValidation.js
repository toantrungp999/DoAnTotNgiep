const Joi = require("@hapi/joi");

const postCategoryValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(500).required(),
    categoryGroupId: Joi.string().trim().min(3).max(500).required(),
  });
  return schema.validate(data);
};

const putCategoryValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
    categoryGroupId: Joi.string().trim().min(3).max(500).required(),
    name: Joi.string().trim().min(3).max(500).required(),
    status: Joi.boolean().required(),
  });
  return schema.validate(data);
};

module.exports.postCategoryValidation = postCategoryValidation;
module.exports.putCategoryValidation = putCategoryValidation;
