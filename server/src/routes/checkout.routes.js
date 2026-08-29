//server/src/routes/checkout.routes.js
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const paystack = require("../services/paystack");
const { protect } = require("../middleware/auth");
const { calculateShipping } = require("../config/shipping");
const {
  createNotification,
  countUnreadNotifications,
} = require("../services/notification.service");
const { sendPushToUser } = require("../services/push.service");

const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")[0]
  .trim()
  .replace(/\/$/, "");

router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      customerName, email, phone, address, city, state, country, notes,
      paymentMethod = "paystack",
    } = req.body;

    if (!["paystack", "cash_on_delivery"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Choose a valid payment method." });
    }

    if (paymentMethod === "cash_on_delivery" && country !== "NG") {
      return res.status(400).json({
        message: "Payment on delivery is currently available for deliveries within Nigeria only.",
      });
    }

    // 1. GET CART
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. BUILD ORDER ITEMS
    let subtotal = 0;

    const validCartItems = cart.items.filter((item) => item.productId);

    if (validCartItems.length !== cart.items.length) {
      return res.status(400).json({
        message:
          "Some products in your cart no longer exist. Please remove them and try again.",
      });
    }

    const orderItems = validCartItems.map((item) => {
      const product = item.productId;

      const itemTotal = Number(product.price || 0) * item.quantity;

      subtotal += itemTotal;

      return {
        productId: product._id.toString(),
        name: product.name,
        image: product.coverImage,
        price: Number(product.price || 0),
        quantity: item.quantity,
      };
    });

    const shippingData = await calculateShipping({
      country,
      items: cart.items,
    });

    if (shippingData.shippingAvailable === false) {
      return res.status(400).json({
        message:
          shippingData.message ||
          "Shipping is not available for the selected destination.",
      });
    }

    const shippingFee = shippingData.shippingFee || 0;

    const totalAmount = subtotal + shippingFee;
    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const confirmationTokenHash = crypto
      .createHash("sha256")
      .update(confirmationToken)
      .digest("hex");

    let paymentReference;
    let authorizationUrl;

    // 3. Start Paystack only for online payments. COD orders go straight to confirmation.
    if (paymentMethod === "paystack") {
      const payment = await paystack.post("/transaction/initialize", {
        email,
        amount: totalAmount * 100,
        currency: "NGN",
        callback_url: `${clientUrl}/success?order_token=${confirmationToken}`,
        metadata: { userId, customerName, phone, address, city, state, country, notes },
      });
      paymentReference = payment.data.data.reference;
      authorizationUrl = payment.data.data.authorization_url;
    }

    // 4. CREATE ORDER (pending) with valid payment reference
    const order = await Order.create({
      userId,
      customerName,
      email,
      phone,
      address,
      city,
      state,
      notes,
      items: orderItems,
      subtotal,
      shippingFee,
      paymentStatus: "pending",
      deliveryStatus: "pending",
      deliveryFee: shippingFee,
      deliveryZone: country,
      deliveryEstimate: shippingData.estimatedDays || "",
      shippingService: shippingData.serviceName || "",
      deliveryContact: phone,
      totalAmount,
      currency: "NGN",
      paymentMethod,
      cashCollectionStatus: paymentMethod === "cash_on_delivery" ? "pending_collection" : "not_applicable",
      paymentReference,
      confirmationTokenHash,
      confirmationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Create notification for user
    const orderNotif = await createNotification({
      userId,
      type: "order.created",
      title: "Order Placed",
      body: paymentMethod === "cash_on_delivery"
        ? `Your order #${order._id.toString().slice(-6).toUpperCase()} has been received. Please pay the delivery agent on arrival.`
        : `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed. Awaiting payment confirmation.`,
      link: `/dashboard`,
      data: { orderId: order._id },
    });

    // Send push notification if subscribed
    if (orderNotif) {
      const unreadCount = await countUnreadNotifications(userId);

      await sendPushToUser(userId, {
        title: "Order Placed",
        body: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed.`,
        link: `/dashboard`,
        badgeCount: unreadCount,
        data: { orderId: order._id },
      }).catch((err) => {
        console.warn("Push notification failed (non-critical):", err);
      });
    }

    if (paymentMethod === "cash_on_delivery") {
      await Cart.findOneAndUpdate({ userId }, { items: [] });
      return res.json({
        checkoutType: "cash_on_delivery",
        confirmation_url: `${clientUrl}/success?order_token=${confirmationToken}`,
        shipping: shippingData,
      });
    }

    res.json({
      checkoutType: "paystack",
      authorization_url: authorizationUrl,
      reference: paymentReference,
      shipping: shippingData,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      message: "Checkout failed",
    });
  }
});

module.exports = router;
