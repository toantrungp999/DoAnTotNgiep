const Joi = require("@hapi/joi");

const postCategoryGroupValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(500).required(),
  });
  return schema.validate(data);
};

const putCategoryGroupValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
    name: Joi.string().trim().min(3).max(500).required(),
    status: Joi.boolean().required(),
  });
  return schema.validate(data);
};

module.exports.postCategoryGroupValidation = postCategoryGroupValidation;
module.exports.putCategoryGroupValidation = putCategoryGroupValidation;
