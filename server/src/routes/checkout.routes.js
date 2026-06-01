//server/src/routes/checkout.routes.js
const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const paystack = require("../services/paystack");
const { protect } = require("../middleware/auth");
const { calculateShipping } = require("../config/shipping");

router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const { customerName, email, phone, address, city, state, notes } =
      req.body;

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

    const deliveryMethod = req.body.deliveryMethod || "home";

    const installationNeeded = req.body.installationNeeded || "no";

    const shippingData = await calculateShipping({
      city,
      state,
      items: cart.items,
    });

    if (shippingData.shippingAvailable === false) {
      return res.status(400).json({
        message:
          shippingData.message ||
          "Shipping is not available for the selected state or city.",
      });
    }

    const shippingFee = shippingData.shippingFee || 0;

    const totalAmount = subtotal + shippingFee;

    // 3. INIT PAYSTACK
    const payment = await paystack.post("/transaction/initialize", {
      email,
      amount: totalAmount * 100,
      currency: "NGN",
      callback_url: `${process.env.CLIENT_URL}/success`,
      metadata: {
        userId,
        customerName,
        phone,
        address,
        city,
        state,
        notes,
      },
    });

    const data = payment.data.data;

    // 4. CREATE ORDER (pending) with valid payment reference
    await Order.create({
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
      deliveryMethod,
      installationNeeded,
      paymentStatus: "pending",
      deliveryStatus: "pending",
      deliveryFee: shippingFee,
      deliveryZone: state,
      deliveryContact: phone,
      totalAmount,
      currency: "NGN",
      paymentReference: data.reference,
    });

    res.json({
      authorization_url: data.authorization_url,
      reference: data.reference,

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
