const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { verifyToken } = require("../middleware/auth");

// Middleware for admin check
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all events (Admin)
router.get('/events', auth, isAdmin, async (req, res) => {
  try {
    const events = await Event.find().populate('user', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update event with budget details (Admin)
router.put('/event/:id/budget', auth, isAdmin, async (req, res) => {
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