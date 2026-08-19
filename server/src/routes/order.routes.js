//server/src/routes/order.routes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

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

module.exports = router;
