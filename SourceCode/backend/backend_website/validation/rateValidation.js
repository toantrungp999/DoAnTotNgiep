const Joi = require("@hapi/joi");

const postRateValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().trim().min(6).max(255).required(),
    rate: Joi.number().min(1).max(5).required(),
    content: Joi.string().trim().min(1).max(2500),
  });
  return schema.validate(data);
};

const postReplyValidation = (data) => {
  const schema = Joi.object({
    rateId: Joi.string().trim().min(6).max(255).required(),
    reply: Joi.string().trim().min(1).max(2500),
  });
  return schema.validate(data);
};

const putRateValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().trim().min(6).max(255).required(),
    rateId: Joi.string().trim().min(6).max(255).required(),
    rate: Joi.number().min(1).max(5).required(),
    content: Joi.string().trim().min(1).max(2500),
  });
  return schema.validate(data);
};

const putReplyValidation = (data) => {
  console.log(data);
  const schema = Joi.object({
    rateId: Joi.string().trim().min(6).max(255).required(),
    replyId: Joi.string().trim().min(6).max(255).required(),
    content: Joi.string().trim().min(1).max(2500),
  });
  return schema.validate(data);
};

const deleteReplyValidation = (data) => {
  const schema = Joi.object({
    rateId: Joi.string().trim().min(6).max(255).required(),
    productId: Joi.string().trim().min(6).max(255).required(),
    replyId: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const deleteRateValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().trim().min(6).max(255).required(),
    rateId: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

module.exports.postRateValidation = postRateValidation;
module.exports.postReplyValidation = postReplyValidation;
module.exports.putRateValidation = putRateValidation;
module.exports.putReplyValidation = putReplyValidation;
module.exports.deleteRateValidation = deleteRateValidation;
module.exports.deleteReplyValidation = deleteReplyValidation;
