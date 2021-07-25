const mongoose = require("mongoose");
const CartSchema = mongoose.Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Carts", CartSchema);
