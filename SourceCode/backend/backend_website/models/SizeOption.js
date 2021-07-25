const mongoose = require("mongoose");
const SizeOptionSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Products",
  },
  size: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("SizeOptions", SizeOptionSchema);
