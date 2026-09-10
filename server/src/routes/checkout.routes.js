//server/src/routes/checkout.routes.js
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const StorePaymentSettings = require("../models/StorePaymentSettings");
const paystack = require("../services/paystack");
const { protect } = require("../middleware/auth");
const { calculateShipping } = require("../config/shipping");
const {
  createNotification,
  countUnreadNotifications,
  notifyAdmins,
} = require("../services/notification.service");
const { sendPushToAdmins, sendPushToUser } = require("../services/push.service");

const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")[0]
  .trim()
  .replace(/\/$/, "");

const guestCheckoutAttempts = new Map();

function allowGuestCheckout(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "");
  const ip = (forwardedFor.split(",")[0] || req.ip || "unknown").trim();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const limit = 8;
  const recent = (guestCheckoutAttempts.get(ip) || []).filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (recent.length >= limit) return false;
  recent.push(now);
  guestCheckoutAttempts.set(ip, recent);
  return true;
}

function validGuestItems(items) {
  return Array.isArray(items) && items.length > 0 && items.length <= 20 && items.every(
    (item) => item?.productId && Number.isSafeInteger(Number(item.quantity)) && Number(item.quantity) > 0 && Number(item.quantity) <= 50,
  );
}

function getCheckoutPrice(product) {
  const regularPrice = Number(product.price || 0);
  const salePrice = product.salePrice == null ? null : Number(product.salePrice);
  return salePrice != null && Number.isFinite(salePrice) && salePrice >= 0 && salePrice < regularPrice
    ? salePrice
    : regularPrice;
}

router.post("/guest", async (req, res) => {
  try {
    if (!allowGuestCheckout(req)) {
      return res.status(429).json({ message: "Too many checkout attempts. Please wait a few minutes and try again." });
    }

    const { customerName, email, phone, address, state, country = "NG", notes = "", pickupTransportCompany, pickupOtherLocation, deliveryMethod = "delivery", items } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").trim();
    const normalizedName = String(customerName || "").trim();

    if (!normalizedName || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || !normalizedPhone) {
      return res.status(400).json({ message: "Enter your name, a valid email address, and phone number." });
    }
    if (!validGuestItems(items)) {
      return res.status(400).json({ message: "Your guest cart is invalid. Review the selected products and quantities." });
    }

    const selectedPickupLocation = String(pickupTransportCompany || "").trim() === "Other / specify a transport company or park"
      ? String(pickupOtherLocation || "").trim()
      : String(pickupTransportCompany || "").trim();
    if (deliveryMethod === "delivery" && (!String(address || "").trim() || !selectedPickupLocation)) {
      return res.status(400).json({ message: "Enter your address or landmark and select a transport company or park." });
    }
    if (!['delivery', 'pickup'].includes(deliveryMethod)) {
      return res.status(400).json({ message: "Choose a valid delivery method." });
    }

    const requestedById = new Map(items.map((item) => [String(item.productId), Number(item.quantity)]));
    const products = await Product.find({
      _id: { $in: [...requestedById.keys()] },
      hidden: { $ne: true },
      pendingApproval: { $ne: true },
      pendingDeletion: { $ne: true },
      status: { $ne: "inactive" },
      approved: { $ne: false },
    });

    if (products.length !== requestedById.size) {
      return res.status(400).json({ message: "One or more products are no longer available. Refresh your cart and try again." });
    }

    let subtotal = 0;
    const orderItems = products.map((product) => {
      const quantity = requestedById.get(String(product._id));
      if (Number(product.stock || 0) < quantity) {
        const error = new Error(`${product.name} no longer has enough stock.`);
        error.statusCode = 400;
        throw error;
      }
      const price = getCheckoutPrice(product);
      subtotal += price * quantity;
      return { productId: String(product._id), name: product.name, image: product.coverImage, price, quantity };
    });

    const shippingData = deliveryMethod === "pickup"
      ? { shippingAvailable: true, shippingFee: 0, serviceName: "Pickup", estimatedDays: "Ready after confirmation" }
      : await calculateShipping({ country, state, items: orderItems });
    if (shippingData.shippingAvailable === false) {
      return res.status(400).json({ message: shippingData.message || "Shipping is not available for the selected destination." });
    }

    const shippingFee = Number(shippingData.shippingFee || 0);
    const totalAmount = subtotal + shippingFee;
    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const confirmationTokenHash = crypto.createHash("sha256").update(confirmationToken).digest("hex");
    const payment = await paystack.post("/transaction/initialize", {
      email: normalizedEmail,
      amount: totalAmount * 100,
      currency: "NGN",
      callback_url: `${clientUrl}/success?order_token=${confirmationToken}`,
      metadata: { guestCheckout: true, customerName: normalizedName, phone: normalizedPhone, state, country, transportCompanyPickupPoint: selectedPickupLocation },
    });

    const order = await Order.create({
      guestCheckout: true,
      customerName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      address: String(address || "").trim(),
      state: String(state || "").trim(),
      notes: String(notes || "").trim(),
      items: orderItems,
      subtotal,
      shippingFee,
      deliveryFee: shippingFee,
      totalAmount,
      currency: "NGN",
      paymentMethod: "paystack",
      paymentStatus: "pending",
      deliveryStatus: "pending",
      deliveryZone: String(country || "NG").toUpperCase(),
      deliveryMethod,
      pickupLocation: deliveryMethod === "pickup" ? "EASYLIFE WELLNESS HUB, Benin City" : "",
      transportCompanyPickupPoint: deliveryMethod === "delivery" ? selectedPickupLocation : "",
      deliveryEstimate: shippingData.estimatedDays || "",
      shippingService: shippingData.serviceName || "",
      deliveryContact: normalizedPhone,
      paymentReference: payment.data.data.reference,
      confirmationTokenHash,
      confirmationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const admins = await User.find({ role: "admin", isDeleted: { $ne: true }, isSuspended: { $ne: true } }).select("_id").lean();
    const adminIds = admins.map((admin) => admin._id);
    if (adminIds.length) {
      const title = "New guest order";
      const body = `${normalizedName} placed a guest order for ₦${Number(totalAmount).toLocaleString()}.`;
      await notifyAdmins({ type: "order.created.guest", title, body, link: `/admin/orders/${order._id}`, data: { orderId: order._id, guestCheckout: true } }, adminIds);
      await sendPushToAdmins(adminIds, { title, body, link: `/admin/orders/${order._id}`, data: { orderId: order._id, guestCheckout: true } }).catch((error) => console.warn("Guest order push notification failed:", error));
    }

    res.status(201).json({ checkoutType: "paystack", authorization_url: payment.data.data.authorization_url, reference: payment.data.data.reference });
  } catch (error) {
    console.error("Guest checkout failed:", error.response?.data || error.message);
    res.status(error.statusCode || 500).json({ message: error.message || "Guest checkout could not be started." });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      customerName, email, phone, address, city, state, country, notes, pickupTransportCompany, pickupOtherLocation,
      paymentMethod = "paystack", distributorCode = "", deliveryMethod = "delivery",
    } = req.body;

    if (!["paystack", "cash_on_delivery", "distributor_transfer", "manual_bank_transfer"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Choose a valid payment method." });
    }
    const selectedPickupLocation = String(pickupTransportCompany || "").trim() === "Other / specify a transport company or park"
      ? String(pickupOtherLocation || "").trim()
      : String(pickupTransportCompany || "").trim();
    if (deliveryMethod === "delivery" && !selectedPickupLocation) {
      return res.status(400).json({ message: "Select the transport company or motor park you prefer." });
    }

    let distributor = null;
    if (distributorCode) {
      distributor = await User.findOne({ distributorCode: String(distributorCode).toUpperCase(), distributorStatus: "approved", isSuspended: { $ne: true }, isDeleted: { $ne: true } });
      if (!distributor) return res.status(400).json({ message: "The selected distributor is no longer available." });
    }
    if (paymentMethod === "distributor_transfer" && !distributor) return res.status(400).json({ message: "Bank transfer is available only through an approved distributor shop." });
    if (paymentMethod === "distributor_transfer" && (!distributor.distributorBankName || !distributor.distributorAccountNumber)) return res.status(400).json({ message: "This distributor has not completed payment details yet." });
    let storePaymentSettings = null;
    if (paymentMethod === "manual_bank_transfer") {
      storePaymentSettings = await StorePaymentSettings.findOne({ key: "default" });
      if (!storePaymentSettings?.manualTransferEnabled || !storePaymentSettings.bankName || !storePaymentSettings.accountName || !storePaymentSettings.accountNumber) {
        return res.status(400).json({ message: "Manual bank transfer is not available at the moment." });
      }
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

      const unitPrice = getCheckoutPrice(product);
      const itemTotal = unitPrice * item.quantity;

      subtotal += itemTotal;

      return {
        productId: product._id.toString(),
        name: product.name,
        image: product.coverImage,
        price: unitPrice,
        quantity: item.quantity,
      };
    });

    const shippingData = deliveryMethod === "pickup" ? { shippingAvailable: true, shippingFee: 0, serviceName: "Pickup", estimatedDays: "Ready after confirmation" } : await calculateShipping({ country, state, items: cart.items });

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
        metadata: { userId, customerName, phone, state, country, notes, transportCompanyPickupPoint: selectedPickupLocation },
      });
      paymentReference = payment.data.data.reference;
      authorizationUrl = payment.data.data.authorization_url;
    }

    // 4. CREATE ORDER (pending) with valid payment reference
    const order = await Order.create({
      userId,
      distributorId: distributor?._id || null,
      distributorCode: distributor?.distributorCode || "",
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
      deliveryMethod,
      pickupLocation: deliveryMethod === "pickup" ? (distributor?.distributorPickupAddress || "EASYLIFE WELLNESS HUB, Benin City") : "",
      transportCompanyPickupPoint: deliveryMethod === "delivery" ? selectedPickupLocation : "",
      paymentInstructions: paymentMethod === "distributor_transfer" ? `Transfer ₦${totalAmount.toLocaleString()} to ${distributor.distributorAccountName} · ${distributor.distributorAccountNumber} · ${distributor.distributorBankName}` : "",
      deliveryEstimate: shippingData.estimatedDays || "",
      shippingService: shippingData.serviceName || "",
      deliveryContact: phone,
      totalAmount,
      currency: "NGN",
      paymentMethod,
      cashCollectionStatus: paymentMethod === "cash_on_delivery" ? "pending_collection" : "not_applicable",
      manualTransferStatus: paymentMethod === "manual_bank_transfer" ? "pending_verification" : "not_applicable",
      paymentReference,
      confirmationTokenHash,
      confirmationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    if (paymentMethod === "manual_bank_transfer") {
      order.paymentInstructions = `Transfer ${totalAmount.toLocaleString()} NGN to ${storePaymentSettings.accountName} · ${storePaymentSettings.accountNumber} · ${storePaymentSettings.bankName}${storePaymentSettings.transferInstructions ? `. ${storePaymentSettings.transferInstructions}` : ""}`;
      await order.save();
    }
    if (paymentMethod === "cash_on_delivery") {
      order.paymentInstructions = "When the delivery agent arrives, make an online transfer to the official EASYLIFE WELLNESS HUB account sent to your WhatsApp or phone number. The agent confirms payment before handing over the order and does not collect cash.";
      await order.save();
    }

    // Create notification for user
    const orderNotif = await createNotification({
      userId,
      type: "order.created",
      title: paymentMethod === "paystack" ? "Payment required" : "Order Placed",
      body: paymentMethod === "cash_on_delivery"
        ? `Order #${order._id.toString().slice(-6).toUpperCase()} is pay on delivery. Transfer to the official EASYLIFE account when the agent arrives; payment must be confirmed before handover.`
        : paymentMethod === "manual_bank_transfer"
          ? `Your order #${order._id.toString().slice(-6).toUpperCase()} is awaiting bank-transfer verification.`
        : `Payment is incomplete for order #${order._id.toString().slice(-6).toUpperCase()}. Complete payment before delivery can begin.`,
      link: `/dashboard`,
      data: { orderId: order._id },
    });

    // Send push notification if subscribed
    if (orderNotif) {
      const unreadCount = await countUnreadNotifications(userId);

      await sendPushToUser(userId, {
        title: paymentMethod === "paystack" ? "Payment required" : "Order Placed",
        body: paymentMethod === "paystack" ? `Complete payment for order #${order._id.toString().slice(-6).toUpperCase()} before delivery can begin.` : `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed.`,
        link: `/dashboard`,
        badgeCount: unreadCount,
        data: { orderId: order._id },
      }).catch((err) => {
        console.warn("Push notification failed (non-critical):", err);
      });
    }

    // A customer order is also an operational event. Notify every active
    // administrator with a direct link to the fulfilment details.
    const admins = await User.find({ role: "admin", isDeleted: { $ne: true }, isSuspended: { $ne: true } }).select("_id").lean();
    const adminIds = admins.map((admin) => admin._id);
    if (adminIds.length) {
      const orderCode = order.orderNumber || `#${order._id.toString().slice(-6).toUpperCase()}`;
      const adminTitle = "New order placed";
      const adminBody = `${orderCode}: ${customerName} placed an order for ₦${Number(totalAmount).toLocaleString()}.`;
      const adminLink = `/admin/orders/${order._id}`;
      const adminNotifications = await notifyAdmins({
        type: "order.created.admin",
        title: adminTitle,
        body: adminBody,
        link: adminLink,
        data: { orderId: order._id, paymentMethod, paymentStatus: order.paymentStatus },
      }, adminIds);

      if (adminNotifications.length) {
        await sendPushToAdmins(adminIds, {
          title: adminTitle,
          body: adminBody,
          link: adminLink,
          data: { orderId: order._id, paymentMethod, paymentStatus: order.paymentStatus },
        }).catch((error) => console.warn("Admin order push notification failed (non-critical):", error));
      }
    }

    if (["cash_on_delivery", "distributor_transfer", "manual_bank_transfer"].includes(paymentMethod)) {
      await Cart.findOneAndUpdate({ userId }, { items: [] });
      return res.json({
        checkoutType: paymentMethod,
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
