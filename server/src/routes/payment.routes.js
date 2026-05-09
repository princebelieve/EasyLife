//server/src/routes/payment.routes.js
const express = require("express");

const paystack = require("../services/paystack");

const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

router.post("/initialize", async (req, res) => {
  try {
    const { productId, customerName, email, phone } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const paystackResponse = await paystack.post("/transaction/initialize", {
      email,

      amount: Number(product.price || 0) * 100,

      currency: "NGN",

      callback_url: `${process.env.CLIENT_URL}/success`,

      metadata: {
        productId: product._id.toString(),
        customerName,
        phone,
      },
    });

    const paymentData = paystackResponse.data.data;

    await Order.create({
      productId: product._id.toString(),
      productName: product.name,
      customerName,
      email,
      phone,
      amount: product.price,
      currency: "NGN",
      paymentReference: paymentData.reference,
      paymentStatus: "pending",
    });

    res.json({
      authorization_url: paymentData.authorization_url,
      reference: paymentData.reference,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      message: "Unable to initialize payment",
    });
  }
});

router.get("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await paystack.get(`/transaction/verify/${reference}`);

    const paymentData = response.data.data;

    const order = await Order.findOne({
      paymentReference: reference,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (paymentData.status === "success") {
      order.paymentStatus = "paid";

      await order.save();
    }

    res.json(order);
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      message: "Verification failed",
    });
  }
});

module.exports = router;
