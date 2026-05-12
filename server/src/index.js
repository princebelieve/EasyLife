//server/src/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const paymentRoutes = require("./routes/payment.routes");
const paystackWebhookRoutes = require("./routes/paystack.webhook.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const authRoutes = require("./routes/auth.routes");
const measurementRoutes = require("./routes/measurementRoutes");
const cartRoutes = require("./routes/cart.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

connectDB();

app.use("/api/paystack/webhook", express.json(), paystackWebhookRoutes);

// middleware
app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173").split(","),
    credentials: true,
  }),
);

app.use(express.json());

// routes
app.use("/api/auth", authRoutes); // ✅ ADD THIS
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("NewBrend Furniture API is running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
