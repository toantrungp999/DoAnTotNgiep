const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  googleId: {
    type: String,
    required: false,
    min: 6,
    max: 1024,
  },
  facebookId: {
    type: String,
    required: false,
    min: 6,
    max: 1024,
  },
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  role: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    min: 6,
    max: 12,
  },
  birthday: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  image: {
    type: String,
    required: false,
    default:
      "https://res.cloudinary.com/websitebandienthoai/image/upload/v1604746122/blog/84241059_189132118950875_4138507100605120512_n_bo3wan.jpg",
  },
  male: {
    type: Boolean,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  addresses: [
    {
      city: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
        required: true,
      },
      streetOrBuilding: {
        type: String,
        required: true,
      },
      isDefault: {
        type: Boolean,
        required: true,
      },
      status: {
        type: Boolean,
        required: true,
      },
    },
  ],
  storeWork: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Stores",
    default: null,
  },
  visitProduct: {
    type: Array,
    required: false,
  },
  visitCategory: {
    type: Array,
    required: false,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
