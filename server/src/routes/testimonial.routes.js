const express = require("express");
const upload = require("../middleware/testimonialUpload");
const {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getTestimonials);
router.get("/admin", protect, adminOnly, getAdminTestimonials);
router.post(
  "/admin",
  protect,
  adminOnly,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]),
  createTestimonial,
);
router.put(
  "/admin/:id",
  protect,
  adminOnly,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]),
  updateTestimonial,
);
router.delete("/admin/:id", protect, adminOnly, deleteTestimonial);

module.exports = router;
