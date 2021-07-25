const mongoose = require("mongoose");
const OrderDetailSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Orders",
  },
  expired: {
    type: Number,
  },
  name: {
    type: String,
    require: true,
  },
  brand: {
    type: String,
    require: true,
  },
  size: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  quantityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "QuantityOptions",
  },
});
module.exports = mongoose.model("OrderDetails", OrderDetailSchema);
