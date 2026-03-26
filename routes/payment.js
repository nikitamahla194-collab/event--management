const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
router.post('/create-order/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const options = {
      amount: event.budget * 100, // Convert to paise
      currency: 'INR',
      receipt: `event_${event._id}`,
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { order_id, payment_id, signature, eventId } = req.body;
    
    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature === signature) {
      await Event.findByIdAndUpdate(eventId, { 
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: payment_id
      });
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;