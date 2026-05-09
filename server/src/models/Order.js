//server/src/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: "",
    },

    productName: {
      type: String,
      default: "",
    },

    customerName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    paymentReference: {
      type: String,
      default: "",
      unique: true,
    },

    paymentStatus: {
      type: String,
      default: "pending",
    },

    deliveryStatus: {
      type: String,
      default: "processing",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
