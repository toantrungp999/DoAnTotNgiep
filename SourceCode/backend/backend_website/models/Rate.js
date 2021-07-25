const mongoose = require("mongoose");
const RateSchema = mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  rate: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
      },
      content: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Rates", RateSchema);
