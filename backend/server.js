import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import gigRoutes from "./routes/gigRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Debugging middleware to catch malformed JSON
app.use((req, res, next) => {
  // Log incoming request info
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // Safely handle JSON parsing with error catching
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    try {
      // Parse body manually to catch errors
      if (req.body && typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
      }
    } catch (error) {
      console.error('JSON parsing error:', error.message);
      console.error('Raw body:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format in request'
      });
    }
  }
  next();
});

// Body parser middleware with error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('Malformed JSON received:', buf.toString());
      res.status(400).json({
        success: false,
        message: 'Invalid JSON format in request'
      });
      throw new Error('Invalid JSON');
    }
  }
}));

// Cookie parser middleware
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "GigFlow API is running..." });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Setup Socket.IO for real-time updates
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Make io accessible globally
global.io = io;

export default server;