//server/src/routes/adminShipping.routes.js
const express = require("express");

const router = express.Router();

const ShippingZone = require("../models/ShippingZone");

const { protect, adminOnly } = require("../middleware/auth");

// GET ALL ZONES
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const zones = await ShippingZone.find().sort({
      createdAt: -1,
    });

    res.json(zones);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to fetch shipping zones",
    });
  }
});

// CREATE ZONE
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const zone = await ShippingZone.create(req.body);

    res.status(201).json(zone);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to create shipping zone",
    });
  }
});

// UPDATE ZONE
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updated = await ShippingZone.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.json(updated);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to update shipping zone",
    });
  }
});

// DELETE ZONE
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await ShippingZone.findByIdAndDelete(req.params.id);

    res.json({
      message: "Shipping zone deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to delete shipping zone",
    });
  }
});

module.exports = router;
