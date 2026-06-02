// server/src/controllers/product.controller.js
const Product = require("../models/Product");

const { uploadToR2 } = require("../config/r2");
const { normalizeDeliveryCategory } = require("../utils/category");

function safeJsonParse(value, fallback = []) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

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
    const product = await Product.findById(req.params.id);

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

      status: status || "active",

      sku: generatedSku,

      weight: Number(weight || 0),

      deliveryEstimate: deliveryEstimate || "7-14 days",

      inStock: Number(stock || 0) > 0,

      pieces,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error in createProduct:", err);

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

    res.json(product);
  } catch (err) {
    console.error("Error in updateProduct:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

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

module.exports = {
  getProducts,
  getProduct,
  getProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
