const mongoose = require("mongoose");
const NotificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  target: {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
    },
    replyComment: {
      type: mongoose.Schema.Types.ObjectId,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    rate: {
      type: mongoose.Schema.Types.ObjectId,
    },
    replyRate: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  action: {
    type: String,
    required: true,
  },
  check: {
    type: Boolean,
    default: false,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Notifications", NotificationSchema);
