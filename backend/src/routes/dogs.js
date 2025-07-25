const express = require("express");
const router = express.Router();
const {
  getDogs,
  getDog,
  createDog,
  updateDog,
  deleteDog,
  uploadDogImages,
  getNearbyDogs,
} = require("../controllers/dogs");
const { protect, authorize } = require("../middleware/auth");

// Public routes
router.get("/", getDogs);
router.get("/nearby", getNearbyDogs);
router.get("/:id", getDog);

// Protected routes
router.post("/", protect, createDog);
router.put("/:id", protect, updateDog);
router.delete("/:id", protect, authorize("admin", "ngo"), deleteDog);
router.post("/:id/images", protect, uploadDogImages);

module.exports = router;
