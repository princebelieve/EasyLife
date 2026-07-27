//server/src/controllers/user.controller.js
const User = require("../models/User");
const { uploadToR2 } = require("../config/r2");

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const avatarUrl = await uploadToR2(req.file, "avatars");

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: avatarUrl,
      },
      {
        new: true,
      },
    ).select("-password");

    res.json({
      message: "Avatar uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Avatar upload failed",
    });
  }
};

module.exports = {
  uploadAvatar,
};
