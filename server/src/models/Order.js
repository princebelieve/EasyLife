//server/src/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
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

    items: {
      type: [orderItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    shippingFee: {
      type: Number,
      default: 0,
    },

    totalAmount: {
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
