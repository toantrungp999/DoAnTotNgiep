const mongoose = require("mongoose");
const MessageSchema = mongoose.Schema({
  //Người gửi tin nhắn đầu tin
  messengerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Messengers",
  },
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
});
module.exports = mongoose.model("Messages", MessageSchema);
