const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Brands",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Categories",
  },
  images: {
    type: Array,
    required: true,
  },
  orgin: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  saleOff: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
  },
  numberComment: {
    type: Number,
    default: 0,
  },
  numberRate: {
    type: Number,
  },
  numberVisit: {
    type: Number,
    default: 0,
  },
  numberBuy: {
    type: Number,
    default: 0,
  },
  avgRate: {
    type: Number,
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

ProductSchema.index({ name: "text" });
module.exports = mongoose.model("Products", ProductSchema);
