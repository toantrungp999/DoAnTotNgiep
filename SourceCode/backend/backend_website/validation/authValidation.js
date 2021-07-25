const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  var now = new Date();
  var min = new Date(
    now.getFullYear() - 120 + 1,
    now.getMonth(),
    now.getDate()
  );
  const schema = Joi.object({
    email: Joi.string().trim().min(6).max(255).required().email(),
    password: Joi.string().trim().min(6).max(255).required(),
    name: Joi.string().trim().min(1).max(500).required(),
    phoneNumber: Joi.string().trim().min(6).max(12).required(),
    birthday: Joi.date().min(min).max(now).required(),
    address: Joi.object({
      city: Joi.string().trim().min(1).max(500).required(),
      district: Joi.string().trim().min(1).max(500).required(),
      ward: Joi.string().trim().min(1).max(500).required(),
      streetOrBuilding: Joi.string().trim().min(1).max(500).required(),
    }).required(),
    male: Joi.boolean().required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(6).max(255).required().email(),
    password: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const loginApiValidation = (data) => {
  const schema = Joi.object({
    tokenId: Joi.string().max(5000),
  });
  return schema.validate(data);
};

const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    code: Joi.string().trim().min(6).max(255).required(),
    password: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const resetPasswordMobileVersionValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(6).max(255).required().email(),
  });
  return schema.validate(data);
};

const verifyOTPValidation = (data) => {
  const schema = Joi.object({
    code: Joi.number().integer().min(100000).max(999999).required(),
  });
  return schema.validate(data);
};

module.exports.verifyOTPValidation = verifyOTPValidation;
module.exports.resetPasswordMobileVersionValidation =
  resetPasswordMobileVersionValidation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.loginApiValidation = loginApiValidation;
module.exports.resetPasswordValidation = resetPasswordValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;
