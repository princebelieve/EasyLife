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

    baseFee: {
      type: Number,
      required: true,
      default: 0,
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
