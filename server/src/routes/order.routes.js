//server/src/routes/order.routes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const paystack = require("../services/paystack");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// 🔥 ONLY RETURN LATEST ORDER (NOT ALL ORDERS)
router.get("/latest", async (req, res) => {
  const order = await Order.findOne().sort({ createdAt: -1 });

  if (!order) {
    return res.json(null);
  }

  res.json(order);
});

// Get order by payment reference (for success/cancel pages)
router.get("/by-reference/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const order = await Order.findOne({
      paymentReference: reference,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching order",
    });
  }
});

router.post("/verify-payment/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    const order = await Order.findOne({ paymentReference: reference });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentStatus === "paid") return res.json(order);

    const response = await paystack.get(`/transaction/verify/${encodeURIComponent(reference)}`);
    const payment = response.data?.data;

    if (payment?.status === "success" && payment?.reference === reference) {
      const paidOrder = await Order.findOneAndUpdate(
        { _id: order._id, paymentStatus: "pending" },
        {
          $set: { paymentStatus: "paid", deliveryStatus: "confirmed", paidAt: new Date() },
          $push: { statusHistory: { status: "confirmed" } },
        },
        { new: true },
      );

      if (paidOrder) {
        for (const item of paidOrder.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity, soldCount: item.quantity },
          });
        }
        await Cart.findOneAndUpdate({ userId: paidOrder.userId }, { items: [] });
        return res.json(paidOrder);
      }
    }

    res.json(order);
  } catch (error) {
    console.error("Paystack verification failed:", error.response?.data || error.message);
    res.status(502).json({ message: "Payment verification is temporarily unavailable." });
  }
});

module.exports = router;
