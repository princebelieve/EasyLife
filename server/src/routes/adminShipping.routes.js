//server/src/routes/adminShipping.routes.js
const express = require("express");

const router = express.Router();

const ShippingZone = require("../models/ShippingZone");
const ShippingSettings = require("../models/ShippingSettings");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/settings", protect, adminOnly, async (req, res) => {
  try {
    const settings = await ShippingSettings.findOneAndUpdate(
      { key: "default" },
      { $setOnInsert: { key: "default" } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch default shipping settings" });
  }
});

router.put("/settings", protect, adminOnly, async (req, res) => {
  try {
    const defaultShippingPrice = Number(req.body.defaultShippingPrice);
    const defaultDeliveryEstimate = String(req.body.defaultDeliveryEstimate || "").trim();

    if (!Number.isFinite(defaultShippingPrice) || defaultShippingPrice < 0) {
      return res.status(400).json({ message: "Default shipping price must be zero or greater." });
    }
    if (!defaultDeliveryEstimate) {
      return res.status(400).json({ message: "A default delivery estimate is required." });
    }

    const settings = await ShippingSettings.findOneAndUpdate(
      { key: "default" },
      { $set: { defaultShippingPrice, defaultDeliveryEstimate } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to save default shipping settings" });
  }
});

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
