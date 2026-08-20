const Testimonial = require("../models/Testimonial");
const { uploadToR2 } = require("../config/r2");

function asBoolean(value) {
  return value === true || value === "true";
}

function publicFilter() {
  return { approved: { $ne: false }, status: "active" };
}

async function keepBannerLimit(currentId) {
  const banners = await Testimonial.find({ bannerEnabled: true, approved: { $ne: false }, status: "active" })
    .sort({ createdAt: 1 });
  const excess = banners.filter((item) => String(item._id) !== String(currentId)).slice(0, Math.max(0, banners.length - 3));
  if (excess.length) await Testimonial.updateMany({ _id: { $in: excess.map((item) => item._id) } }, { $set: { bannerEnabled: false } });
}

async function getTestimonials(req, res) {
  try {
    const filter = { ...publicFilter() };
    if (req.query.featured === "true") filter.featured = true;
    if (req.query.banner === "true") filter.bannerEnabled = true;
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAdminTestimonials(req, res) {
  try {
    const filter = req.user.role === "subadmin" ? { submittedBy: req.user._id } : {};
    res.json(await Testimonial.find(filter).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createTestimonial(req, res) {
  try {
    const { contentType, title, name, role, testimony, linkUrl, videoUrl, featured, bannerEnabled, seoTitle, seoDescription, status } = req.body;
    if (!name || !testimony) return res.status(400).json({ message: "Author or organisation and content are required." });
    const isAdmin = req.user.role === "admin";

    let image = "";
    let videoFile = "";
    if (req.files?.image?.[0]) image = await uploadToR2(req.files.image[0], "testimonials/images");
    if (req.files?.video?.[0]) videoFile = await uploadToR2(req.files.video[0], "testimonials/videos");

    const testimonial = await Testimonial.create({
      contentType, title, name, role, testimony, linkUrl, videoUrl, image, videoFile,
      featured: asBoolean(featured),
      bannerEnabled: isAdmin && asBoolean(bannerEnabled),
      approved: isAdmin,
      status: isAdmin ? (status || "active") : "inactive",
      submittedBy: req.user._id,
      seoTitle, seoDescription,
    });
    if (testimonial.bannerEnabled) await keepBannerLimit(testimonial._id);
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found." });
    if (req.user.role === "subadmin" && String(testimonial.submittedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own submissions." });
    }

    const fields = ["contentType", "title", "name", "role", "testimony", "linkUrl", "videoUrl", "seoTitle", "seoDescription"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) testimonial[field] = req.body[field];
    });
    if (req.user.role === "admin") {
      if (req.body.featured !== undefined) testimonial.featured = asBoolean(req.body.featured);
      if (req.body.bannerEnabled !== undefined) testimonial.bannerEnabled = asBoolean(req.body.bannerEnabled);
      if (req.body.approved !== undefined) testimonial.approved = asBoolean(req.body.approved);
      if (req.body.status !== undefined) testimonial.status = req.body.status;
    } else {
      testimonial.featured = false;
      testimonial.bannerEnabled = false;
      testimonial.approved = false;
      testimonial.status = "inactive";
    }
    if (req.files?.image?.[0]) testimonial.image = await uploadToR2(req.files.image[0], "testimonials/images");
    if (req.files?.video?.[0]) testimonial.videoFile = await uploadToR2(req.files.video[0], "testimonials/videos");

    await testimonial.save();
    if (testimonial.bannerEnabled) await keepBannerLimit(testimonial._id);
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteTestimonial(req, res) {
  try {
    const filter = req.user.role === "subadmin"
      ? { _id: req.params.id, submittedBy: req.user._id }
      : { _id: req.params.id };
    const deleted = await Testimonial.findOneAndDelete(filter);
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
