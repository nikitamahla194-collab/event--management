const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { 
    type: String, 
    enum: ['birthday', 'wedding', 'anniversary', 'workshop', 'tech-fest', 'music-fest', 'art-workshop', 'sports-event'],
    required: true 
  },
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  guestCount: { type: Number, required: true },
  location: { type: String, required: true },
  budget: { type: Number },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  adminResponse: {
    budgetBreakdown: {
      venue: Number,
      catering: Number,
      decoration: Number,
      photography: Number,
      entertainment: Number,
      miscellaneous: Number,
      total: Number
    },
    description: String,
    suggestions: String,
    respondedAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);