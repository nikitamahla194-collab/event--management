const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Event = require("../models/Event");
const { verifyToken } = require("../middleware/auth");

// Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE ORDER =================
router.post("/create-order/:eventId", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const options = {
      amount: event.budget * 100, // paisa → paise
      currency: "INR",
      receipt: `event_${event._id}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      order,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;