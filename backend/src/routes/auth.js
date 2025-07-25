const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update-details", protect, updateDetails);
router.put("/update-password", protect, updatePassword);

module.exports = router;
