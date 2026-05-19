//server/src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { sendResetPasswordEmail } = require("../services/email");
const RefreshToken = require("../models/RefreshToken");

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase());

// 🟢 REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const normalizedEmail = email.toLowerCase();

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: adminEmails.includes(normalizedEmail) ? "admin" : "user",
    });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// 🔵 LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = String(email || "").toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "").toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.json({
        message: "If that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 3600 * 1000;

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")[0]
      .trim();
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    try {
      await sendResetPasswordEmail({
        to: user.email,
        resetUrl,
      });
    } catch (emailError) {
      console.warn(
        "Password reset email could not be sent:",
        emailError.message,
      );
    }

    return res.json({
      message: "If that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Invalid password reset request." });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset token is invalid or has expired." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    // VERIFY JWT
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // CHECK TOKEN EXISTS IN DB
    const existingToken = await RefreshToken.findOne({
      token,
    });

    if (!existingToken) {
      return res.status(401).json({
        message: "Refresh token not recognized",
      });
    }

    // FIND USER
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // DELETE OLD TOKEN (ROTATION)
    await RefreshToken.deleteOne({
      _id: existingToken._id,
    });

    // CREATE NEW TOKENS
    const newAccessToken = generateAccessToken(user);

    const newRefreshToken = generateRefreshToken(user);

    // SAVE NEW REFRESH TOKEN
    await RefreshToken.create({
      user: user._id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};
