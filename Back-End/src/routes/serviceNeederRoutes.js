const express = require("express");
const {
  registerServiceNeeder,
  loginServiceNeeder,
  findMatchingProviders,
  resetPassword,
} = require("../controllers/serviceNeederController");
const authMiddleware = require("../middleware/auth");
const { sendOTP } = require("../utils/mailer");
const ServiceNeeder = require("../models/ServiceNeeder");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/register", registerServiceNeeder);
router.post("/login", loginServiceNeeder);
router.post("/find-providers", authMiddleware, async (req, res, next) => {
  try {
    await findMatchingProviders(req, res);
  } catch (error) {
    next(error);
  }
});

// Generate OTP and send email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await ServiceNeeder.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration to 10 minutes from now
    user.resetOTP = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    await user.save();
    await sendOTP(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP and reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await ServiceNeeder.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOTP || !user.resetOTP.code || !user.resetOTP.expiresAt) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    if (user.resetOTP.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.resetOTP.expiresAt) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Here is where we need to be careful to set the password correctly
    // The pre-save middleware should handle the hashing if we set user.password directly
    user.password = newPassword;
    user.resetOTP = undefined;
    
    // Use console logs for debugging
    console.log(`Setting new password (pre-hash): ${newPassword.slice(0, 3)}... (length: ${newPassword.length})`);
    
    await user.save();
    console.log(`Password saved, hash length: ${user.password.length}`);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add route for token-based password reset (separate from OTP reset)
router.post("/reset-password-token", resetPassword);

module.exports = router;