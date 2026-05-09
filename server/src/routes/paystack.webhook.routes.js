//server/src/routes/webhook.routes.js
const express = require("express");

const crypto = require("crypto");

const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({
        message: "Invalid signature",
      });
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      const existingOrder = await Order.findOne({
        paymentReference: reference,
      });

      if (!existingOrder) {
        return res.json({
          received: true,
        });
      }

      existingOrder.paymentStatus = "paid";

      await existingOrder.save();

      console.log("✅ PAYMENT CONFIRMED:", reference);
    }

    res.json({
      received: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Webhook error",
    });
  }
});

module.exports = router;
