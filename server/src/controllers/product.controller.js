// server/src/controllers/product.controller.js
const Product = require("../models/Product");
const { uploadToR2 } = require("../config/r2");

async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error in getProducts:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error in getProduct:", err);
    res.status(500).json({ error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const name = req.body.name;
    const price = Number(req.body.price);

    if (isNaN(price)) {
      return res.status(400).json({ message: "Invalid price" });
    }

    let image = "";

    if (req.file && req.file.buffer) {
      image = await uploadToR2(req.file);
    }

    const product = await Product.create({
      name,
      price,
      image,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error in createProduct:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name || product.name;
    product.price = Number(req.body.price);

    if (isNaN(product.price)) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (req.file && req.file.buffer) {
      product.image = await uploadToR2(req.file);
      console.log("Updated image uploaded:", product.image);
    }

    await product.save();

    res.json(product);
  } catch (err) {
    console.error("Error in updateProduct:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error in deleteProduct:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
