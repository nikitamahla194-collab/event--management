const express = require("express");
const router = express.Router();

// ✅ correct import
const { verifyToken, isAdmin } = require("../middleware/auth");

// =============================
// ADMIN ROUTE
// =============================
router.get("/dashboard", verifyToken, isAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Welcome Admin 🚀",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;