//server/src/models/Product.js
const mongoose = require("mongoose");

const pieceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    dimensions: {
      type: String,
      default: "",
      trim: true,
    },

    material: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    // COLLECTION NAME
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // URL FRIENDLY NAME
    slug: {
      type: String,
      default: "",
      trim: true,
    },

    // CATEGORY
    category: {
      type: String,
      default: "",
      trim: true,
    },

    // SMALL TEXT FOR CARDS
    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    // FULL DETAIL PAGE DESCRIPTION
    fullDescription: {
      type: String,
      default: "",
      trim: true,
    },

    // MAIN COVER IMAGE
    coverImage: {
      type: String,
      required: true,
    },

    // GALLERY IMAGES
    gallery: {
      type: [String],
      default: [],
    },

    // OPTIONAL STARTING PRICE
    price: {
      type: Number,
      default: 0,
    },

    // FURNITURE PIECES INSIDE THE COLLECTION
    pieces: {
      type: [pieceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
