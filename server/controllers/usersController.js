// controllers/usersController.js

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User registration
export const registerUser = async (req, res) => {
  try {
    // Get user data from the request body
    const { username, email, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token for the newly registered user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    // Send a response with the token and user data
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User login
export const loginUser = async (req, res) => {
  try {
    // Get user data from the request body
    const { email, password } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords match, generate a JWT token and send it in the response
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      return res.status(200).json({ token, user });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User profile route (requires authentication)
export const getUserProfile = async (req, res) => {
  try {
    // Retrieve and send the user's profile data
    // You can customize this based on your user profile data structure
    const userProfile = {
      username: req.user.username,
      email: req.user.email,
    };

    // Send the profile data as a response
    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
