const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Product = require("../models/Product");
const DistributorInventory = require("../models/DistributorInventory");
const DistributorStockOrder = require("../models/DistributorStockOrder");
const User = require("../models/User");
const paystack = require("../services/paystack");

const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim().replace(/\/$/, "");

function approved(req, res, next) {
  if (req.user?.distributorStatus !== "approved") return res.status(403).json({ message: "Distributor approval is required." });
  next();
}

router.get("/store/:code", async (req, res) => {
  const distributor = await User.findOne({ distributorCode: req.params.code.toUpperCase(), distributorStatus: "approved", isSuspended: { $ne: true }, isDeleted: { $ne: true } }).select("name distributorCode city state distributorBankName distributorAccountName distributorAccountNumber distributorPickupAddress distributorPickupEnabled distributorDeliveryEnabled").lean();
  if (!distributor) return res.status(404).json({ message: "This distributor shop is unavailable." });
  const inventory = await DistributorInventory.find({ distributorId: distributor._id, quantity: { $gt: 0 } }).populate("productId", "name coverImage price salePrice shortDescription stock status approved hidden").lean();
  res.json({ distributor, products: inventory.map((item) => ({ ...item.productId, distributorAvailable: item.quantity })).filter((product) => product && product.status === "active" && product.approved !== false && product.hidden !== true) });
});

router.get("/catalog", protect, approved, async (req, res) => {
  const products = await Product.find({ status: "active", approved: { $ne: false }, hidden: { $ne: true }, distributorPrice: { $ne: null } })
    .select("name coverImage price distributorPrice distributorMinimumQuantity stock shortDescription").lean();
  res.json(products.filter((p) => Number(p.distributorPrice) >= 0));
});

router.get("/dashboard", protect, approved, async (req, res) => {
  const inventory = await DistributorInventory.find({ distributorId: req.user._id }).populate("productId", "name coverImage price distributorPrice stock").lean();
  const orders = await DistributorStockOrder.find({ distributorId: req.user._id }).sort({ createdAt: -1 }).limit(20).lean();
  res.json({ distributorCode: req.user.distributorCode, inventory: inventory.filter((item) => item.productId), orders });
});

router.post("/stock-orders", protect, approved, async (req, res) => {
  const requestedItems = Array.isArray(req.body.items) ? req.body.items : [];
  if (!requestedItems.length) return res.status(400).json({ message: "Choose at least one product." });
  const ids = requestedItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: ids }, status: "active", distributorPrice: { $ne: null } });
  const byId = new Map(products.map((p) => [String(p._id), p]));
  let totalAmount = 0;
  const items = [];
  for (const requested of requestedItems) {
    const product = byId.get(String(requested.productId));
    const quantity = Number(requested.quantity);
    if (!product || !Number.isSafeInteger(quantity) || quantity < Number(product.distributorMinimumQuantity || 1)) return res.status(400).json({ message: "One or more stock quantities do not meet the distributor minimum." });
    if (product.stock < quantity) return res.status(400).json({ message: `${product.name} does not have enough central stock.` });
    const unitPrice = Number(product.distributorPrice);
    items.push({ productId: product._id, name: product.name, quantity, unitPrice });
    totalAmount += unitPrice * quantity;
  }
  const payment = await paystack.post("/transaction/initialize", { email: req.user.email, amount: totalAmount * 100, currency: "NGN", callback_url: `${clientUrl}/distributor?stock_payment=processing`, metadata: { distributorId: String(req.user._id), type: "distributor_stock" } });
  const stockOrder = await DistributorStockOrder.create({ distributorId: req.user._id, items, totalAmount, paymentReference: payment.data.data.reference });
  res.json({ authorization_url: payment.data.data.authorization_url, reference: stockOrder.paymentReference });
});

router.post("/sales", protect, approved, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const amount = Number(quantity);
  if (!productId || !Number.isSafeInteger(amount) || amount < 1) return res.status(400).json({ message: "Enter a valid quantity." });
  const inventory = await DistributorInventory.findOneAndUpdate({ distributorId: req.user._id, productId, quantity: { $gte: amount } }, { $inc: { quantity: -amount, unitsSold: amount } }, { new: true });
  if (!inventory) return res.status(400).json({ message: "You do not have enough distributor stock for this sale." });
  res.json(inventory);
});

router.post("/apply", protect, async (req, res) => {
  if (req.user.distributorStatus === "approved") return res.json({ message: "Your distributor account is already approved." });
  req.user.distributorStatus = "pending";
  await req.user.save();
  res.json({ message: "Distributor application submitted for review." });
});

router.put("/settings", protect, approved, async (req, res) => {
  const { bankName, accountName, accountNumber, pickupAddress, pickupEnabled, deliveryEnabled } = req.body;
  req.user.distributorBankName = String(bankName || "").trim();
  req.user.distributorAccountName = String(accountName || "").trim();
  req.user.distributorAccountNumber = String(accountNumber || "").trim();
  req.user.distributorPickupAddress = String(pickupAddress || "").trim();
  req.user.distributorPickupEnabled = pickupEnabled !== false;
  req.user.distributorDeliveryEnabled = deliveryEnabled !== false;
  await req.user.save();
  res.json({ message: "Distributor settings saved." });
});

module.exports = router;
