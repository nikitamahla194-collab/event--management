const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  eventTitle: String,
  eventDate: String,
  seats: {
    type: Number,
    default: 1
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "rejected"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },
  paymentId: String,
  razorpayOrderId: String,
  bookingReference: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique booking reference before saving
bookingSchema.pre("save", async function(next) {
  if (!this.bookingReference) {
    this.bookingReference = "EVT" + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);