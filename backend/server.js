const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello, chatoos backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});