const express = require("express");
const router = express.Router();
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  assignReport,
} = require("../controllers/reports");
const { protect, authorize } = require("../middleware/auth");

// Public routes (can be anonymous)
router.post("/", createReport);

// Protected routes
router.get("/", protect, getReports);
router.get("/:id", protect, getReport);
router.put("/:id", protect, updateReport);
router.delete("/:id", protect, authorize("admin"), deleteReport);
router.put("/:id/assign", protect, authorize("admin", "ngo"), assignReport);

module.exports = router;
