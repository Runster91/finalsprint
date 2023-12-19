// Import necessary libraries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import route files
const checkoutRoute = require('./routes/checkout.js');
const dasht33sRoute = require('./routes/dasht33s.js');
const usersRoute = require('./routes/users.js');

// Initialize Express app
const app = express();
app.use(cors());
dotenv.config();

// Database connection setup (from your existing code)
const connectToDatabase = require('./config/db.js');
connectToDatabase();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/checkout', checkoutRoute);
app.use('/api/v1/dasht33s', dasht33sRoute);
app.use('/api/v1/users', usersRoute);

// Server initialization
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
