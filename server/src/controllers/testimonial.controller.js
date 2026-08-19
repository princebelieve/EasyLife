const Testimonial = require("../models/Testimonial");
const { uploadToR2 } = require("../config/r2");

function asBoolean(value) {
  return value === true || value === "true";
}

function publicFilter() {
  return { approved: { $ne: false }, status: "active" };
}

async function getTestimonials(req, res) {
  try {
    const filter = { ...publicFilter() };
    if (req.query.featured === "true") filter.featured = true;
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAdminTestimonials(req, res) {
  try {
    res.json(await Testimonial.find().sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createTestimonial(req, res) {
  try {
    const { name, role, testimony, videoUrl, featured, seoTitle, seoDescription, status } = req.body;
    if (!name || !testimony) return res.status(400).json({ message: "Name and testimony are required." });

    let image = "";
    let videoFile = "";
    if (req.files?.image?.[0]) image = await uploadToR2(req.files.image[0], "testimonials/images");
    if (req.files?.video?.[0]) videoFile = await uploadToR2(req.files.video[0], "testimonials/videos");

    const testimonial = await Testimonial.create({
      name, role, testimony, videoUrl, image, videoFile,
      featured: asBoolean(featured),
      seoTitle, seoDescription, status: status || "active",
    });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found." });

    const fields = ["name", "role", "testimony", "videoUrl", "seoTitle", "seoDescription", "status"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) testimonial[field] = req.body[field];
    });
    if (req.body.featured !== undefined) testimonial.featured = asBoolean(req.body.featured);
    if (req.body.approved !== undefined) testimonial.approved = asBoolean(req.body.approved);
    if (req.files?.image?.[0]) testimonial.image = await uploadToR2(req.files.image[0], "testimonials/images");
    if (req.files?.video?.[0]) testimonial.videoFile = await uploadToR2(req.files.video[0], "testimonials/videos");

    await testimonial.save();
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteTestimonial(req, res) {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Testimonial not found." });
    res.json({ message: "Testimonial deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
