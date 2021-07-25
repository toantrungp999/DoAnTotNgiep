const mongoose = require("mongoose");
const CategoryGroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
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
module.exports = mongoose.model("CategoryGroups", CategoryGroupSchema);
