const Joi = require("@hapi/joi");

const postCommentValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().trim().min(6).max(255).required(),
    content: Joi.string().trim().min(1).max(2500),
  });
  return schema.validate(data);
};

const postReplyValidation = (data) => {
  const schema = Joi.object({
    commentId: Joi.string().trim().min(6).max(255).required(),
    reply: Joi.string().trim().min(1).max(2500),
  });
  return schema.validate(data);
};

const putCommentValidation = (data) => {
  const schema = Joi.object({
    commentId: Joi.string().trim().min(6).max(255).required(),
    content: Joi.string().trim().min(1).max(2500),
  });
  return schema.validate(data);
};

const putReplyValidation = (data) => {
  const schema = Joi.object({
    commentId: Joi.string().trim().min(6).max(255).required(),
    replyId: Joi.string().trim().min(6).max(255).required(),
    content: Joi.string().trim().min(1).max(2500),
  });
  return schema.validate(data);
};

const deleteReplyValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().trim().min(6).max(255).required(),
    commentId: Joi.string().trim().min(6).max(255).required(),
    replyId: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const deleteCommentValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().trim().min(6).max(255).required(),
    commentId: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
};

module.exports.postCommentValidation = postCommentValidation;
module.exports.postReplyValidation = postReplyValidation;
module.exports.putCommentValidation = putCommentValidation;
module.exports.putReplyValidation = putReplyValidation;
module.exports.deleteCommentValidation = deleteCommentValidation;
module.exports.deleteReplyValidation = deleteReplyValidation;
