const express = require("express");
const router = express.Router();

// Placeholder route for users
router.get("/", (req, res) => {
  res.status(200).json({ message: "User route not implemented yet" });
});

module.exports = router; 