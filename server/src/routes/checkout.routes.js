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

    const orderItems = cart.items.map((item) => {
      const product = item.productId;

      const itemTotal = product.price * item.quantity;

      subtotal += itemTotal;

      return {
        productId: product._id.toString(),
        name: product.name,
        image: product.coverImage,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const deliveryMethod = req.body.deliveryMethod || "home";

    const installationNeeded = req.body.installationNeeded || "no";

    const shippingClass =
      cart.items[0]?.productId?.shippingClass || "furniture";

    const shippingFee = await calculateShipping({
      city,
      state,
      shippingClass,
    });

    const totalAmount = subtotal + shippingFee;

    // 3. CREATE ORDER (pending)
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
      deliveryMethod,
      installationNeeded,
      paymentStatus: "pending",
      deliveryStatus: "pending",
      deliveryFee: shippingFee,
      deliveryZone: state,
      deliveryContact: phone,
      totalAmount,
      currency: "NGN",
    });

    // 4. INIT PAYSTACK
    const payment = await paystack.post("/transaction/initialize", {
      email,
      amount: totalAmount * 100,
      currency: "NGN",
      callback_url: `${process.env.CLIENT_URL}/success`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    const data = payment.data.data;

    // 5. SAVE REFERENCE TO ORDER
    order.paymentReference = data.reference;
    await order.save();

    res.json({
      authorization_url: data.authorization_url,
      reference: data.reference,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      message: "Checkout failed",
    });
  }
});

module.exports = router;
