const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "", trim: true },
    testimony: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    videoUrl: { type: String, default: "", trim: true },
    videoFile: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    seoTitle: { type: String, default: "", trim: true },
    seoDescription: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
