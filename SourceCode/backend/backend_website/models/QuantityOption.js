const mongoose = require("mongoose");
const QuantityOptionSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Products",
  },
  sizeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "SizeOptions",
  },
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ColorOptions",
  },
  quantity: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("QuantityOptions", QuantityOptionSchema);
