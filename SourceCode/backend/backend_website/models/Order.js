const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  staffName: {
    type: String,
    required: false,
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  orderType: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    require: false,
  },
  receiveType: {
    type: String,
    required: true,
  },
  receiveAddress: {
    type: String,
    required: true,
  },
  shippingFee: {
    type: Number,
    required: false,
  },
  shipOrderId: {
    type: String,
    require: false,
  },
  shipBrand: {
    type: String,
    require: false,
  },
  expectedReceiveDate: {
    type: Date,
    require: false,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
  actionLog: [
    {
      action: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
      description: {
        type: String,
        required: false,
        default: "",
      },
    },
  ],
});

module.exports = mongoose.model("Orders", OrderSchema);
