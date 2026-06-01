//server/src/routes/admin.order.routes.js
const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/auth");

// GET ALL ORDERS
router.get("/", protect, adminOnly, async (req, res) => {
  const orders = await Order.find({ archived: { $ne: true } }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// GET SINGLE ORDER
router.get("/:id", protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

// UPDATE DELIVERY STATUS
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const { deliveryStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  order.deliveryStatus = deliveryStatus;

  order.statusHistory.push({
    status: deliveryStatus,
  });

  await order.save();

  res.json(order);
});

// ARCHIVE ORDER
router.put("/:id/archive", protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  order.archived = true;
  await order.save();

  res.json(order);
});

module.exports = router;
