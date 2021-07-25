const mongoose = require("mongoose");
const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CategoryGroups",
  },
  status: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Categories", CategorySchema);
