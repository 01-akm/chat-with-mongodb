const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware to accept JSON data
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Mount routers
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello, chatoos backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});