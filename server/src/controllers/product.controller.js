// server/src/controllers/product.controller.js
const Product = require("../models/Product");
const User = require("../models/User");
const { uploadToR2 } = require("../config/r2");
const { normalizeDeliveryCategory } = require("../utils/category");
const {
  createNotification,
  notifyAdmins,
} = require("../services/notification.service");
const { sendPushToAdmins } = require("../services/push.service");

function safeJsonParse(value, fallback = []) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find({
      hidden: { $ne: true },
      pendingApproval: { $ne: true },
      pendingDeletion: { $ne: true },
      status: { $ne: "inactive" },
      approved: { $ne: false },
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Error in getProducts:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}

async function getProduct(req, res) {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      hidden: { $ne: true },
      pendingApproval: { $ne: true },
      pendingDeletion: { $ne: true },
      status: { $ne: "inactive" },
      approved: { $ne: false },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    console.error("Error in getProduct:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}

async function getProductCategories(req, res) {
  try {
    const products = await Product.find({}, "category deliveryCategory").lean();

    const configMap = require("../config/productCategoryMap");

    const map = new Map();

    for (const p of products) {
      const categoryName = (p.category || "").toString().trim();
      const delivery =
        p.deliveryCategory || normalizeDeliveryCategory(categoryName);

      if (!map.has(delivery)) {
        const label =
          Object.keys(configMap).find((k) => configMap[k] === delivery) ||
          categoryName ||
          delivery;

        map.set(delivery, {
          deliveryCategory: delivery,
          label,
          sampleCategory: categoryName,
        });
      }
    }

    // Ensure all configured categories are present
    for (const [label, slug] of Object.entries(configMap)) {
      if (!map.has(slug)) {
        map.set(slug, { deliveryCategory: slug, label, sampleCategory: "" });
      }
    }

    const list = Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );

    res.json(list);
  } catch (err) {
    console.error("Error in getProductCategories:", err);
    res.status(500).json({
      error: err.message,
    });
  }
}

function generateSKU(name, category) {
  const prefix = (category || "GEN").slice(0, 3).toUpperCase();

  const namePart = (name || "ITEM")
    .replace(/\s+/g, "")
    .slice(0, 5)
    .toUpperCase();

  const timePart = Date.now().toString().slice(-5);

  const randomPart = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${namePart}-${timePart}-${randomPart}`;
}

async function createProduct(req, res) {
  try {
    const {
      name,
      slug,
      category,
      shortDescription,
      fullDescription,
      price,
      stock,
      deliveryCategory,
      featured,
      status,
      weight,
      deliveryEstimate,
    } = req.body;

    const files = req.files || {};

    // COVER IMAGE
    let coverImage = "";

    if (files.coverImage?.[0]) {
      coverImage = await uploadToR2(files.coverImage[0]);
    }

    // GALLERY
    const gallery = [];

    if (files.gallery?.length) {
      for (const file of files.gallery) {
        const uploaded = await uploadToR2(file);

        gallery.push(uploaded);
      }
    }

    // PIECES
    const piecesInput = safeJsonParse(req.body.pieces, []);

    const pieceImages = files.pieceImages || [];

    const pieces = [];

    for (let i = 0; i < piecesInput.length; i++) {
      const piece = piecesInput[i];

      let image = "";

      if (pieceImages[i]) {
        image = await uploadToR2(pieceImages[i]);
      }

      pieces.push({
        name: piece.name || "",

        image,

        dimensions: piece.dimensions || "",

        material: piece.material || "",

        description: piece.description || "",

        price: Number(piece.price || 0),
      });
    }

    const generatedSku = generateSKU(name, category);

    const isSubadmin = req.user?.role === "subadmin";

    const adminUsers = await User.find({ role: "admin" }).select("_id");
    const adminIds = adminUsers.map((admin) => admin._id);

    const product = await Product.create({
      name,

      slug,

      category,

      shortDescription,

      fullDescription,

      coverImage,

      gallery,

      price: Number(price || 0),

      stock: Number(stock || 0),

      deliveryCategory: normalizeDeliveryCategory(category),

      featured: featured === "true" || featured === true,

      status: isSubadmin ? "inactive" : status || "active",

      sku: generatedSku,

      weight: Number(weight || 0),

      deliveryEstimate: deliveryEstimate || "7-14 days",

      inStock: Number(stock || 0) > 0,

      pieces,
      approved: !isSubadmin,
      pendingApproval: isSubadmin,
      hidden: isSubadmin,
      submittedBy: isSubadmin ? req.user._id : undefined,
      approvalRequestedBy: isSubadmin ? req.user._id : undefined,
    });

    if (adminIds.length > 0) {
      await notifyAdmins(
        {
          type: "product.upload",
          title: "Product upload submitted",
          body: `"${product.name}" has been submitted for review.`,
          link: `/admin/products/${product._id}`,
          data: {
            productId: product._id,
            status: isSubadmin ? "pending" : "published",
          },
        },
        adminIds,
      );

      await sendPushToAdmins(adminIds, {
        title: "Product upload submitted",
        body: `"${product.name}" has been submitted for review.`,
        link: `/admin/products/${product._id}`,
        data: { productId: product._id, type: "product.upload" },
      }).catch((pushErr) => console.warn("Push to admins failed:", pushErr));
    }

    res.status(201).json(product);
  } catch (err) {
    console.error("Error in createProduct:", err);

    try {
      const admins = await User.find({ role: "admin" }).select("_id");
      const adminIds = admins.map((admin) => admin._id);

      if (adminIds.length > 0) {
        await notifyAdmins(
          {
            type: "product.upload.failed",
            title: "Product upload failed",
            body: `A product upload failed: ${err.message}`,
            link: "/admin/products",
            data: { error: err.message },
          },
          adminIds,
        );
      }
    } catch (notifyErr) {
      console.warn(
        "Failed to notify admins about product upload error:",
        notifyErr,
      );
    }

    res.status(500).json({
      error: err.message,
    });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const {
      name,
      slug,
      category,
      shortDescription,
      fullDescription,
      price,
      stock,
      deliveryCategory,
      featured,
      status,
      sku,
      weight,
      deliveryEstimate,
    } = req.body;

    const files = req.files || {};

    // BASIC FIELDS
    product.name = name || product.name;

    product.slug = slug || product.slug;

    product.category = category || product.category;

    product.deliveryCategory = normalizeDeliveryCategory(product.category);

    product.shortDescription = shortDescription || product.shortDescription;

    product.fullDescription = fullDescription || product.fullDescription;

    product.price = Number(price || product.price);

    if (stock !== undefined) {
      product.stock = Number(stock || 0);

      product.inStock = Number(stock || 0) > 0;
    }

    if (featured !== undefined) {
      product.featured = featured === true || featured === "true";
    }

    if (status) {
      product.status = status;
    }

    if (weight !== undefined) {
      product.weight = Number(weight || 0);
    }

    if (deliveryEstimate) {
      product.deliveryEstimate = deliveryEstimate;
    }

    // COVER IMAGE
    if (files.coverImage?.[0]) {
      product.coverImage = await uploadToR2(files.coverImage[0]);
    }

    // GALLERY
    if (files.gallery?.length) {
      const gallery = [];

      for (const file of files.gallery) {
        const uploaded = await uploadToR2(file);

        gallery.push(uploaded);
      }

      product.gallery = gallery;
    }

    // PIECES
    const piecesInput = safeJsonParse(req.body.pieces, []);

    if (piecesInput.length) {
      const pieceImages = files.pieceImages || [];

      const pieces = [];

      for (let i = 0; i < piecesInput.length; i++) {
        const piece = piecesInput[i];

        let image = product.pieces[i]?.image || "";

        if (pieceImages[i]) {
          image = await uploadToR2(pieceImages[i]);
        }

        pieces.push({
          name: piece.name || "",

          image,

          dimensions: piece.dimensions || "",

          material: piece.material || "",

          description: piece.description || "",

          price: Number(piece.price || 0),
        });
      }

      product.pieces = pieces;
    }

    await product.save();

    const admins = await User.find({ role: "admin" }).select("_id");
    const adminIds = admins.map((admin) => admin._id);

    if (adminIds.length > 0) {
      await notifyAdmins(
        {
          type: "product.updated",
          title: "Product updated",
          body: `"${product.name}" was updated successfully.`,
          link: `/admin/products/${product._id}`,
          data: { productId: product._id },
        },
        adminIds,
      );
    }

    // Check for low stock alert
    const LOW_STOCK_THRESHOLD = 5;
    if (product.stock <= LOW_STOCK_THRESHOLD && product.stock > 0) {
      const admins = await User.find({ role: "admin" }).select("_id");
      const adminIds = admins.map((admin) => admin._id);

      if (adminIds.length > 0) {
        await notifyAdmins(
          {
            type: "stock.alert",
            title: "Low Stock Alert",
            body: `Product "${product.name}" has low stock: ${product.stock} unit(s) remaining.`,
            link: `/admin/products/${product._id}`,
            data: { productId: product._id, stock: product.stock },
          },
          adminIds,
        );
      }
    }

    res.json(product);
  } catch (err) {
    console.error("Error in updateProduct:", err);

    try {
      const admins = await User.find({ role: "admin" }).select("_id");
      const adminIds = admins.map((admin) => admin._id);

      if (adminIds.length > 0) {
        await notifyAdmins(
          {
            type: "product.update.failed",
            title: "Product update failed",
            body: `Product update failed: ${err.message}`,
            link: "/admin/products",
            data: { error: err.message },
          },
          adminIds,
        );
      }
    } catch (notifyErr) {
      console.warn(
        "Failed to notify admins about product update error:",
        notifyErr,
      );
    }

    res.status(500).json({
      error: err.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (req.user.role === "subadmin") {
      product.pendingDeletion = true;
      product.hidden = true;
      product.deletionRequestedBy = req.user._id;
      product.deletionRequestedAt = Date.now();
      await product.save();

      return res.json({
        message:
          "Delete request submitted. Product is hidden until an admin approves or rejects it.",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteProduct:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}

async function getAdminProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error in getAdminProduct:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getAdminProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Error in getAdminProducts:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}

async function approveProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.pendingApproval) {
      product.pendingApproval = false;
      product.approved = true;
      product.hidden = false;
      product.status = "active";
      await product.save();

      return res.json({ message: "Product approved", product });
    }

    if (product.pendingDeletion) {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: "Product deletion approved and executed" });
    }

    return res
      .status(400)
      .json({ message: "No pending approval or deletion request found" });
  } catch (err) {
    console.error("Error in approveProduct:", err);
    res.status(500).json({ error: err.message });
  }
}

async function rejectProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.pendingApproval) {
      product.pendingApproval = false;
      product.hidden = true;
      product.status = "inactive";
      await product.save();

      return res.json({ message: "Product approval rejected" });
    }

    if (product.pendingDeletion) {
      product.pendingDeletion = false;
      product.hidden = false;
      await product.save();

      return res.json({ message: "Product deletion request rejected" });
    }

    return res
      .status(400)
      .json({ message: "No pending approval or deletion request found" });
  } catch (err) {
    console.error("Error in rejectProduct:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getProducts,
  getProduct,
  getProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProduct,
  getAdminProducts,
  approveProduct,
  rejectProduct,
};
