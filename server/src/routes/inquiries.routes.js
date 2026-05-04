// server/src/routes/inquiries.routes.js
import express from "express";
import Inquiry from "../models/Inquiry.js";

const router = express.Router();

// Create new inquiry
router.post("/", async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json({ message: "Inquiry submitted successfully" });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ message: "Failed to submit inquiry" });
  }
});

// Get all inquiries (admin only - you might want to add auth middleware)
router.get("/", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Failed to fetch inquiries" });
  }
});

export default router;