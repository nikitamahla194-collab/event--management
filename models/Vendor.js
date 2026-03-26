const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['venue', 'catering', 'decoration', 'photography', 'entertainment'],
    required: true 
  },
  pricePerPerson: Number,
  priceRange: {
    min: Number,
    max: Number
  },
  rating: { type: Number, min: 0, max: 5 },
  location: String,
  contact: String,
  images: [String],
  availability: [{ date: Date, isAvailable: Boolean }],
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Vendor', VendorSchema);