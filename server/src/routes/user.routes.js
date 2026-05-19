//server/src/routes/user.routes.js
const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const Order = require("../models/Order");

const User = require("../models/User");
const upload = require("../middleware/upload");
const { uploadAvatar } = require("../controllers/user.controller");

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json(user);
});

router.get("/orders", protect, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(orders);
});

router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.json({
    user,
    orders,
  });
});

module.exports = router;
