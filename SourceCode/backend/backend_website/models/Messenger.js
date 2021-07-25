const mongoose = require("mongoose");
const MessengerSchema = mongoose.Schema({
  //Người gửi tin nhắn đầu tin
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Users",
  },
  //
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Users",
  },
  //save news message
  message: {
    // user1 or user2
    sender: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  check: {
    type: Boolean,
    default: false,
    required: true,
  },
});
module.exports = mongoose.model("Messengers", MessengerSchema);
