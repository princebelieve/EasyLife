//server/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { refreshToken } = require("../controllers/auth.controller");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  changePassword,
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/refresh", refreshToken);
router.post("/change-password", require("../middleware/auth"), changePassword);

module.exports = router;
