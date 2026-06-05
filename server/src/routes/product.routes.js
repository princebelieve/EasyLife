// server/src/routes/product.routes.js
const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  getProducts,
  getProduct,
  getProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const {
  protect,
  adminOnly,
  adminOrSubadminOnly,
} = require("../middleware/auth");

// PUBLIC
router.get("/", getProducts);

router.get("/categories", getProductCategories);

router.get("/:id", getProduct);

// ADMIN
router.post(
  "/",
  protect,
  adminOrSubadminOnly,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
    { name: "pieceImages", maxCount: 50 },
  ]),
  createProduct,
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
    { name: "pieceImages", maxCount: 50 },
  ]),
  updateProduct,
);

router.delete("/:id", protect, adminOrSubadminOnly, deleteProduct);

module.exports = router;
