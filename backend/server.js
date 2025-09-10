const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); // ✅ Required to serve static files

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message');
const User = require('./models/User'); // <-- Import the User model

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',             // For development, we allow all connections.
    methods: ['GET', 'POST'],// Add allowed HTTP methods here
  },
});

const userSocketMap = {};

// Middleware to parse JSON requests
app.use(express.json());

// ✅ Serve uploaded files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello, chatoos backend is running!');
});

// --- Socket.IO handling ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('registerUser', async (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID ${socket.id}`);

    // --- NEW STATUS LOGIC ---
    await User.findByIdAndUpdate(userId, { status: 'online', lastSeen: new Date() });
    socket.broadcast.emit('userStatus', { userId, status: 'online' });
  });

  socket.on('sendMessage', async ({ senderId, recipientId, content }) => {
    const newMessage = new Message({ senderId, recipientId, content });
    await newMessage.save();
    const recipientSocketId = userSocketMap[recipientId];

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receiveMessage', newMessage);
    }

    socket.emit('receiveMessage', newMessage);
  });

  // --- WebRTC signaling ---
  socket.on('call-user', (data) => {
    const recipientSocketId = userSocketMap[data.recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('incoming-call', {
        callerId: data.callerId,
        callerName: data.callerName,
        signal: data.signal,
      });
    }
  });

  socket.on('answer-call', (data) => {
    const callerSocketId = userSocketMap[data.callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-accepted', {
        signal: data.signal,
      });
    }
  });

  socket.on('ice-candidate', (data) => {
    const targetSocketId = userSocketMap[data.targetId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice-candidate', {
        candidate: data.candidate,
      });
    }
  });

  socket.on('call-ended', (data) => {
    const targetSocketId = userSocketMap[data.targetId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('call-ended');
    }
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];

        // --- NEW STATUS LOGIC ---
        await User.findByIdAndUpdate(userId, { status: 'offline', lastSeen: new Date() });
        socket.broadcast.emit('userStatus', { userId, status: 'offline' });
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
