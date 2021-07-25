const Joi = require("@hapi/joi");
const approveOrderValidation = (data) => {
  const schema = Joi.object({
    dataSerials: Joi.array()
      .items({
        orderDetailId: Joi.string().trim().min(6).max(255).required(),
        serials: Joi.array().min(1).max(5).required(),
      })
      .required(),
  });
  return schema.validate(data);
};

const updateSerialValidation = (data) => {
  const schema = Joi.object({
    dataSerials: Joi.array()
      .items({
        orderDetailId: Joi.string().trim().min(6).max(255).required(),
        serials: Joi.array().min(1).max(5).required(),
      })
      .required(),
  });
  return schema.validate(data);
};

module.exports.approveOrderValidation = approveOrderValidation;
module.exports.updateSerialValidation = updateSerialValidation;
