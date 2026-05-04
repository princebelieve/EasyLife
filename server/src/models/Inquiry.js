//server/src/models/Inquiry.js
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    projectType: { type: String, required: true }, // ready-to-ship, custom-design, room-makeover, commercial, consultation
    roomType: { type: String }, // living-room, bedroom, dining-room, office, kitchen, bathroom, outdoor

    budget: { type: String }, // under-1000, 1000-5000, 5000-15000, 15000-30000, over-30000
    timeline: { type: String }, // asap, 1-3-months, 3-6-months, 6-months-plus, just-planning

    message: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Inquiry", inquirySchema);