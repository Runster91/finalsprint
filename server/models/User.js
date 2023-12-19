const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // This option trims leading/trailing spaces from the username
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true, // This option trims leading/trailing spaces from the email
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  // Additional fields...
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
