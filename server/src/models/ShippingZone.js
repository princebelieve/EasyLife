//server/src/models/ShippingZone.js
const mongoose = require("mongoose");

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

    baseFee: {
      type: Number,
      default: 0,
    },

    sameCityFee: {
      type: Number,
      default: 0,
    },

    lightFee: {
      type: Number,
      default: 0,
    },

    mediumFee: {
      type: Number,
      default: 0,
    },

    heavyFee: {
      type: Number,
      default: 0,
    },

    furnitureFee: {
      type: Number,
      default: 0,
    },

    decorFee: {
      type: Number,
      default: 0,
    },

    installationFee: {
      type: Number,
      default: 0,
    },

    customProjectFee: {
      type: Number,
      default: 0,
    },

    pickupEnabled: {
      type: Boolean,
      default: true,
    },

    installationAvailable: {
      type: Boolean,
      default: true,
    },

    estimatedDays: {
      type: String,
      default: "3-7 days",
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
