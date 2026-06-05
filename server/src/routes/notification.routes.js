const express = require("express");
const { protect, adminOnly } = require("../middleware/auth");
const Notification = require("../models/Notification");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const filter = {
      userId: req.user.id,
      status: "approved",
    };

    if (typeof req.query.archived !== "undefined") {
      filter.archived = req.query.archived === "true";
    }

    if (typeof req.query.read !== "undefined") {
      filter.read = req.query.read === "true";
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.get("/requests", protect, async (req, res) => {
  try {
    const filter = { status: "pending" };

    if (req.user.role === "subadmin") {
      filter.senderId = req.user.id;
    }

    const requests = await Notification.find(filter).sort({
      createdAt: -1,
    });

    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notification requests" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { userId, type, title, body, link, data } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "subadmin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const isSubadmin = req.user.role === "subadmin";

    const notification = await Notification.create({
      userId,
      type,
      title,
      body,
      link,
      data,
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      status: isSubadmin ? "pending" : "approved",
      requestedAt: isSubadmin ? Date.now() : undefined,
      reviewedAt: isSubadmin ? undefined : Date.now(),
      reviewedBy: isSubadmin ? undefined : req.user._id,
    });

    res.status(isSubadmin ? 202 : 201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create notification" });
  }
});

router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, status: "approved" },
      { read: req.body.read !== undefined ? req.body.read : true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

router.put("/mark-all-read", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false, status: "approved" },
      { read: true },
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark notifications read" });
  }
});

module.exports = router;
