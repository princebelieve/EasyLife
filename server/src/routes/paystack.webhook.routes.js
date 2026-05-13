//server/src/routes/paystack.webhook.routes.js
const express = require("express");

const crypto = require("crypto");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

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

      const order = await Order.findOne({
        paymentReference: reference,
      });

      if (!order) {
        return res.json({
          received: true,
        });
      }

      // prevent double stock deduction
      if (order.paymentStatus === "paid") {
        return res.json({
          received: true,
        });
      }

      order.paymentStatus = "paid";

      order.deliveryStatus = "confirmed";

      order.paidAt = new Date();

      order.statusHistory.push({
        status: "confirmed",
      });

      // update stock for every ordered item
      for (const item of order.items) {
        const product = await Product.findById(item.productId);

        if (!product) continue;

        product.stock = Math.max(0, product.stock - item.quantity);

        product.soldCount = (product.soldCount || 0) + item.quantity;

        await product.save();
      }

      await order.save();

      await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });

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
