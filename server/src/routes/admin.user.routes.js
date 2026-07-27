const express = require("express");

const router = express.Router();

const { protect, adminOnly } = require("../middleware/auth");

const User = require("../models/User");

// GET /api/admin/users - list users
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role isSuspended isDeleted createdAt")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch users" });
  }
});

// PUT /api/admin/users/:id - update suspend / soft-delete flags and role
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { isSuspended, isDeleted, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof isSuspended !== "undefined") {
      user.isSuspended = !!isSuspended;
    }

    if (typeof isDeleted !== "undefined") {
      user.isDeleted = !!isDeleted;
      user.deletedAt = isDeleted ? Date.now() : null;
    }

    if (role) {
      const validRoles = ["user", "admin", "subadmin"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      user.role = role;
    }

    await user.save();

    res.json({
      message: "User updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuspended: user.isSuspended,
        isDeleted: user.isDeleted,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Unable to update user" });
  }
});

module.exports = router;
