const express = require("express");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Get public VAPID key for push notification subscription
router.get("/vapid-public-key", (req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return res.status(500).json({
      message:
        "VAPID public key not configured. Push notifications are unavailable.",
    });
  }

  res.json({ publicKey });
});

// Subscribe to push notifications
// In a production setup, you would store this subscription in the database
// and use it to send push notifications to the user
router.post("/subscribe", protect, async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        message: "Invalid subscription object",
      });
    }

    // Here you would typically save the subscription to the database
    // associated with the user:
    // await UserPushSubscription.create({
    //   userId: req.user.id,
    //   subscription: JSON.stringify(subscription),
    // });

    res.json({
      success: true,
      message: "Successfully subscribed to push notifications",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to subscribe to push notifications",
    });
  }
});

// Unsubscribe from push notifications
router.post("/unsubscribe", protect, async (req, res) => {
  try {
    // Here you would typically remove the subscription from the database:
    // await UserPushSubscription.deleteOne({
    //   userId: req.user.id,
    //   subscription: JSON.stringify(req.body.subscription),
    // });

    res.json({
      success: true,
      message: "Successfully unsubscribed from push notifications",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to unsubscribe from push notifications",
    });
  }
});

module.exports = router;
