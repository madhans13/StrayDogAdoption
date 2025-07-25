const express = require("express");
const router = express.Router();
const {
  getAdoptionApplications,
  getAdoptionApplication,
  createAdoptionApplication,
  updateAdoptionApplication,
  deleteAdoptionApplication,
  approveAdoptionApplication,
  rejectAdoptionApplication,
} = require("../controllers/adoptions");
const { protect, authorize } = require("../middleware/auth");

// Protected routes
router.get("/", protect, getAdoptionApplications);
router.get("/:id", protect, getAdoptionApplication);
router.post("/", protect, createAdoptionApplication);
router.put("/:id", protect, updateAdoptionApplication);
router.delete("/:id", protect, deleteAdoptionApplication);

// Admin/NGO routes
router.put(
  "/:id/approve",
  protect,
  authorize("admin", "ngo"),
  approveAdoptionApplication,
);
router.put(
  "/:id/reject",
  protect,
  authorize("admin", "ngo"),
  rejectAdoptionApplication,
);

module.exports = router;
