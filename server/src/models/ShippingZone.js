//server/src/models/ShippingZone.js
const mongoose = require("mongoose");

const categoryPricingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const shippingZoneSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    cities: {
      type: [String],
      default: [],
    },

    distanceLabel: {
      type: String,
      default: "",
    },

    baseDeliveryFee: {
      type: Number,
      default: 0,
    },

    categoryPricing: {
      type: [categoryPricingSchema],
      default: [],
    },

    estimatedDays: {
      type: String,
      default: "3-7 days",
    },

    pickupEnabled: {
      type: Boolean,
      default: true,
    },

    installationAvailable: {
      type: Boolean,
      default: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ShippingZone", shippingZoneSchema);
