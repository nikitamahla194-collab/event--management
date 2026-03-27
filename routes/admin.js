const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User'); // ✅ ADD THIS

// ✅ correct import
const { verifyToken } = require("../middleware/auth");


// =============================
// ADMIN CHECK
// =============================
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id); // ✅ _id use

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =============================
// GET ALL EVENTS (ADMIN)
// =============================
router.get('/events', verifyToken, isAdmin, async (req, res) => {
  try {
    const events = await Event.find().populate('user', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =============================
// UPDATE EVENT (ADMIN)
// =============================
router.put('/event/:id/budget', verifyToken, isAdmin, async (req, res) => {
  try {
    const { budgetBreakdown, description, suggestions } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.adminResponse = {
      budgetBreakdown,
      description,
      suggestions,
      respondedAt: new Date()
    };

    event.status = 'approved';
    event.budget = budgetBreakdown.total;

    await event.save();

    res.json(event);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;