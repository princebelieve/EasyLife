const express = require("express");
const crypto = require("crypto");
const Order = require("../models/Order");

const router = express.Router();

// The checkout creates a high-entropy token that is valid for 24 hours and
// consumed atomically on first use. Payment references must never grant access
// to order/contact data.
router.get("/confirmation/:token", async (req, res) => {
  try {
    const confirmationTokenHash = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const order = await Order.findOneAndUpdate(
      {
        confirmationTokenHash,
        confirmationTokenExpires: { $gt: new Date() },
      },
      { $unset: { confirmationTokenHash: 1, confirmationTokenExpires: 1 } },
      { new: false },
    );

    if (!order) {
      return res.status(404).json({
        message: "This order confirmation link is invalid, expired, or has already been used.",
      });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to load order confirmation" });
  }
});

module.exports = router;
