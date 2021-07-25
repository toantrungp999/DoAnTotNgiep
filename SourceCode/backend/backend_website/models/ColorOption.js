const mongoose = require("mongoose");
const ColorOptionSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Products",
  },
  color: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("ColorOptions", ColorOptionSchema);
