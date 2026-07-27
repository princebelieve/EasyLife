//server/src/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const paystackWebhookRoutes = require("./routes/paystack.webhook.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const authRoutes = require("./routes/auth.routes");
const measurementRoutes = require("./routes/measurementRoutes");
const cartRoutes = require("./routes/cart.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const userRoutes = require("./routes/user.routes");
const adminOrderRoutes = require("./routes/admin.order.routes");
const adminUserRoutes = require("./routes/admin.user.routes");
const adminProductRoutes = require("./routes/admin.product.routes");
const adminNotificationRoutes = require("./routes/admin.notification.routes");
const shippingRoutes = require("./routes/shipping.routes");
const inquiryRoutes = require("./routes/inquiries.routes");
const adminShippingRoutes = require("./routes/adminShipping.routes");
const notificationRoutes = require("./routes/notification.routes");
const pushRoutes = require("./routes/push.routes");

const Product = require("./models/Product");
const ShippingZone = require("./models/ShippingZone");

const app = express();

connectDB();

// Paystack requires the raw request body for signature verification
app.use(
  "/api/paystack/webhook",
  express.raw({ type: "application/json" }),
  paystackWebhookRoutes,
);

// middleware
app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")
      .map((url) => url.trim()),
    credentials: true,
  }),
);

app.use(express.json());

// DYNAMIC SITEMAP - serves at root level for Google
app.get("/sitemap.xml", async (req, res) => {
  try {
    const products = await Product.find({ active: true }).select(
      "_id updatedAt",
    );

    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const baseUrl =
      process.env.CLIENT_URL ||
      process.env.BASE_URL ||
      (host ? `${protocol}://${host}` : "http://localhost:5173");

    // Determine a default shipping price (lowest active baseDeliveryFee) to include in the feed.
    // Merchant Center accepts product-level <g:shipping> entries; providing a conservative
    // default helps listings show a shipping estimate. For accurate per-order shipping,
    // configure shipping settings inside Merchant Center or extend the feed generation.
    let defaultShippingPrice = 0;
    try {
      const zones = await ShippingZone.find({ active: true }).select(
        "baseDeliveryFee",
      );
      if (zones && zones.length > 0) {
        defaultShippingPrice = zones.reduce((min, z) => {
          const v = Number(z.baseDeliveryFee || 0);
          return min === null || v < min ? v : min;
        }, null);
        if (defaultShippingPrice === null) defaultShippingPrice = 0;
      } else {
        defaultShippingPrice = Number(process.env.DEFAULT_SHIPPING_PRICE || 0);
      }
    } catch (err) {
      console.warn(
        "Unable to compute default shipping price for feed:",
        err.message || err,
      );
      defaultShippingPrice = Number(process.env.DEFAULT_SHIPPING_PRICE || 0);
    }
    const staticPages = [
      { loc: baseUrl, priority: "1.00" },
      { loc: `${baseUrl}/collection`, priority: "0.90" },
      { loc: `${baseUrl}/contact`, priority: "0.80" },
      { loc: `${baseUrl}/about`, priority: "0.70" },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach((page) => {
      xml += "  <url>\n";
      xml += `    <loc>${page.loc}</loc>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += "  </url>\n";
    });

    // Add product pages
    products.forEach((product) => {
      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}/product/${product._id}</loc>\n`;
      xml += `    <lastmod>${product.updatedAt.toISOString()}</lastmod>\n`;
      xml += "    <priority>0.75</priority>\n";
      xml += "  </url>\n";
    });

    xml += "</urlset>";

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).json({ error: "Failed to generate sitemap" });
  }
});

// GOOGLE SHOPPING FEED - for Google Merchant Center
app.get("/feed.xml", async (req, res) => {
  try {
    const products = await Product.find({ active: true });

    const baseUrl =
      process.env.CLIENT_URL || process.env.BASE_URL || "http://localhost:5173";

    let defaultShippingPrice = 0;
    let defaultHandlingMinDays = 0;
    let defaultHandlingMaxDays = 1;
    let defaultTransitMinDays = 0;
    let defaultTransitMaxDays = 1;

    try {
      const zones = await ShippingZone.find({ active: true }).select(
        "baseDeliveryFee handlingTimeMinDays handlingTimeMaxDays transitTimeMinDays transitTimeMaxDays",
      );

      if (zones && zones.length > 0) {
        defaultShippingPrice = zones.reduce((min, z) => {
          const v = Number(z.baseDeliveryFee || 0);
          return min === null || v < min ? v : min;
        }, null);

        if (defaultShippingPrice === null) {
          defaultShippingPrice = Number(
            process.env.DEFAULT_SHIPPING_PRICE || 0,
          );
        }

        defaultHandlingMinDays = Math.min(
          ...zones.map((z) => Number(z.handlingTimeMinDays || 0)),
          0,
        );
        defaultHandlingMaxDays = Math.max(
          ...zones.map((z) => Number(z.handlingTimeMaxDays || 0)),
          1,
        );
        defaultTransitMinDays = Math.min(
          ...zones.map((z) => Number(z.transitTimeMinDays || 0)),
          0,
        );
        defaultTransitMaxDays = Math.max(
          ...zones.map((z) => Number(z.transitTimeMaxDays || 0)),
          1,
        );
      } else {
        defaultShippingPrice = Number(process.env.DEFAULT_SHIPPING_PRICE || 0);
      }
    } catch (err) {
      console.warn(
        "Unable to compute default shipping values for feed:",
        err.message || err,
      );
      defaultShippingPrice = Number(process.env.DEFAULT_SHIPPING_PRICE || 0);
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml +=
      '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">\n';
    xml += `  <title>Newbrend Furniture Products</title>\n`;
    xml += `  <link rel="alternate" type="text/html" href="${baseUrl}"/>\n`;
    xml += `  <updated>${new Date().toISOString()}</updated>\n`;
    xml += `  <author><name>Newbrend Furniture</name></author>\n`;

    products.forEach((product) => {
      // Availability: use Google canonical values
      const availability =
        product.inStock === false || Number(product.stock || 0) <= 0
          ? "out_of_stock"
          : "in_stock";

      const itemId = product.sku || product._id;
      const description =
        product.fullDescription || product.shortDescription || product.name;

      // Derive per-product transit times from `deliveryEstimate` when available
      // Expect formats like "7-14 days" or "3 - 5 days"
      let productTransitMin = defaultTransitMinDays;
      let productTransitMax = defaultTransitMaxDays;
      try {
        const de = (product.deliveryEstimate || "").toString();
        const m = de.match(/(\d+)\s*-\s*(\d+)/);
        if (m) {
          productTransitMin = Number(m[1]);
          productTransitMax = Number(m[2]);
        }
      } catch (e) {
        // fallback to defaults
      }

      xml += "  <entry>\n";
      xml += `    <id>${baseUrl}/product/${product._id}</id>\n`;
      xml += `    <g:id>${escapeXml(String(itemId))}</g:id>\n`;
      xml += `    <title>${escapeXml(product.name)}</title>\n`;
      xml += `    <description>${escapeXml(description)}</description>\n`;
      xml += `    <link rel="alternate" type="text/html" href="${baseUrl}/product/${product._id}"/>\n`;
      xml += `    <g:image_link>${product.coverImage}</g:image_link>\n`;
      xml += `    <g:price>${Number(product.price || 0).toFixed(2)} NGN</g:price>\n`;
      xml += `    <g:availability>${availability}</g:availability>\n`;
      xml += `    <g:brand>${escapeXml(product.brand || "Newbrend Furniture")}</g:brand>\n`;
      xml += `    <g:condition>new</g:condition>\n`;
      xml += `    <g:product_type>${escapeXml(product.category || "Furniture")}</g:product_type>\n`;
      xml += `    <g:shipping>\n`;
      xml += `      <g:country>NG</g:country>\n`;
      xml += `      <g:region>Delta</g:region>\n`;
      xml += `      <g:service>Standard</g:service>\n`;
      xml += `      <g:price>${Number(defaultShippingPrice).toFixed(2)} NGN</g:price>\n`;
      xml += `      <g:min_handling_time>${defaultHandlingMinDays}</g:min_handling_time>\n`;
      xml += `      <g:max_handling_time>${defaultHandlingMaxDays}</g:max_handling_time>\n`;
      xml += `      <g:min_transit_time>${productTransitMin}</g:min_transit_time>\n`;
      xml += `      <g:max_transit_time>${productTransitMax}</g:max_transit_time>\n`;
      xml += `    </g:shipping>\n`;
      xml += "  </entry>\n";
    });

    xml += "</feed>";

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Feed generation error:", error);
    res.status(500).json({ error: "Failed to generate feed" });
  }
});

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// routes
app.use("/api/auth", authRoutes); // ✅ ADD THIS
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/admin/shipping", adminShippingRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/admin/users", adminUserRoutes);

app.get("/", (req, res) => {
  res.send("NewBrend Furniture API is running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
