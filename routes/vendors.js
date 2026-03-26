const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// Get vendors by category
router.get('/category/:category', async (req, res) => {
  try {
    const vendors = await Vendor.find({ 
      category: req.params.category,
      isActive: true 
    });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vendor recommendation based on budget
router.post('/recommend', async (req, res) => {
  try {
    const { category, budget, guestCount } = req.body;
    const vendors = await Vendor.find({ 
      category,
      isActive: true,
      pricePerPerson: { $lte: budget / guestCount }
    }).sort({ rating: -1 });
    
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;