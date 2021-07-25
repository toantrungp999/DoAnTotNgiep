const Joi = require("@hapi/joi");

const updateUserValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(6).max(255).required(),
    status: Joi.boolean().required(),
    role: Joi.string().trim().min(1).max(255).required(),
  });
  return schema.validate(data);
};

module.exports.updateUserValidation = updateUserValidation;
