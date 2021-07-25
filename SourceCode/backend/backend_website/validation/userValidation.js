const Joi = require("@hapi/joi");

const updateAvatarValidation = (data) => {
  const schema = Joi.object({
    image: Joi.string().trim().min(5).max(500),
  });
  return schema.validate(data);
};

const putProfileValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(1).max(500).required(),
    birthday: Joi.string().trim().min(1).max(255).required(),
    male: Joi.boolean().required(),
  });
  return schema.validate(data);
};

const putPasswordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).max(255).required(),
    newPassword: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const putPhoneValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).max(255).required(),
    phoneNumber: Joi.number().min(111).max(999999999999).required(),
  });
  return schema.validate(data);
};

const postAddressValidation = (data) => {
  const schema = Joi.object({
    city: Joi.string().trim().min(1).max(255).required(),
    district: Joi.string().trim().min(1).max(255).required(),
    ward: Joi.string().trim().min(1).max(255).required(),
    streetOrBuilding: Joi.string().trim().min(1).max(500).required(),
    isDefault: Joi.boolean().required(),
  });
  return schema.validate(data);
};

const putAddressValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().trim().min(1).max(255).required(),
    city: Joi.string().trim().min(1).max(255).required(),
    district: Joi.string().trim().min(1).max(255).required(),
    ward: Joi.string().trim().min(1).max(255).required(),
    streetOrBuilding: Joi.string().trim().min(1).max(500).required(),
    isDefault: Joi.boolean().required(),
  });
  return schema.validate(data);
};

module.exports.updateAvatarValidation = updateAvatarValidation;
module.exports.putProfileValidation = putProfileValidation;
module.exports.putPasswordValidation = putPasswordValidation;
module.exports.putPhoneValidation = putPhoneValidation;
module.exports.postAddressValidation = postAddressValidation;
module.exports.putAddressValidation = putAddressValidation;
