const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

connectDB();

// Import Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const vendorRoutes = require('./routes/vendors');
const chatRoutes = require('./routes/chat');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/chat', chatRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Event Management System API', 
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      admin: '/api/admin',
      payment: '/api/payment',
      vendors: '/api/vendors',
      chat: '/api/chat'
    }
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);
  
  // Join event room
  socket.on('join-event-room', (eventId) => {
    socket.join(`event_${eventId}`);
    console.log(`Socket ${socket.id} joined room: event_${eventId}`);
  });
  
  // Leave event room
  socket.on('leave-event-room', (eventId) => {
    socket.leave(`event_${eventId}`);
    console.log(`Socket ${socket.id} left room: event_${eventId}`);
  });
  
  // Send message
  socket.on('send-message', async (data) => {
    const { eventId, message, userId, userName } = data;
    
    // Save message to database (optional)
    // You can create a Message model to store chat history
    
    // Broadcast to everyone in the event room
    io.to(`event_${eventId}`).emit('receive-message', {
      message,
      userId,
      userName,
      timestamp: new Date(),
      socketId: socket.id
    });
  });
  
  // Admin broadcast
  socket.on('admin-broadcast', (data) => {
    const { eventId, message, adminName } = data;
    io.to(`event_${eventId}`).emit('admin-message', {
      message,
      adminName,
      timestamp: new Date(),
      isAdmin: true
    });
  });
  
  // Typing indicator
  socket.on('typing', (data) => {
    const { eventId, userName, isTyping } = data;
    socket.to(`event_${eventId}`).emit('user-typing', { userName, isTyping });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});