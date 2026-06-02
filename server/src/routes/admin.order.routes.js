//server/src/routes/admin.order.routes.js
const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/auth");

// GET ALL ORDERS OR ARCHIVED ORDERS
router.get("/", protect, adminOnly, async (req, res) => {
  const archived = req.query.archived === "true";

  const filter = {
    archived: archived ? true : { $ne: true },
  };

  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

  if (startDate && !isNaN(startDate.getTime())) {
    filter.createdAt = filter.createdAt || {};
    filter.createdAt.$gte = startDate;
  }

  if (endDate && !isNaN(endDate.getTime())) {
    const inclusiveEnd = new Date(endDate);
    inclusiveEnd.setHours(23, 59, 59, 999);
    filter.createdAt = filter.createdAt || {};
    filter.createdAt.$lte = inclusiveEnd;
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
});

// ARCHIVE ALL ORDERS
router.put("/archive-all", protect, adminOnly, async (req, res) => {
  const result = await Order.updateMany(
    { archived: { $ne: true } },
    { archived: true },
  );

  res.json({
    archivedCount: result.modifiedCount || result.nModified || 0,
  });
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
