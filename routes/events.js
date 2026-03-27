const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ✅ correct import
const { verifyToken } = require("../middleware/auth");

router.get("/...", verifyToken, ...)
// =============================
// CREATE EVENT
// =============================
router.post("/create", verifyToken, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      user: req.user._id, // ⚠️ id nahi, _id use kar
    });

    await event.save();

    res.status(201).json({
      success: true,
      data: event,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// GET USER EVENTS
// =============================
router.get("/my-events", verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id });

    res.json({
      success: true,
      data: events,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;