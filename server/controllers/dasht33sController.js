// controllers/dasht33sController.js

import Dasht33 from '../models/Dasht33.js';

// Create a new Dasht33 (T-shirt)
export const createDasht33 = async (req, res) => {
  try {
    const { size, gender, color, design, price } = req.body;

    // Create a new Dasht33 instance
    const newDasht33 = new Dasht33({
      size,
      gender,
      color,
      design,
      price,
    });

    // Save the Dasht33 to the database
    await newDasht33.save();

    // Send a response with the newly created Dasht33
    res.status(201).json({ dasht33: newDasht33 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a list of all Dasht33s
export const getAllDasht33s = async (req, res) => {
  try {
    const dasht33s = await Dasht33.find();

    // Send a response with the list of Dasht33s
    res.status(200).json({ dasht33s });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get details of a specific Dasht33 by ID
export const getDasht33ById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the Dasht33 by ID
    const dasht33 = await Dasht33.findById(id);

    if (!dasht33) {
      return res.status(404).json({ message: 'Dasht33 not found' });
    }

    // Send a response with the Dasht33 details
    res.status(200).json({ dasht33 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a specific Dasht33 by ID
export const updateDasht33ById = async (req, res) => {
  try {
    const { id } = req.params;
    const { size, gender, color, design, price } = req.body;

    // Find and update the Dasht33 by ID
    const updatedDasht33 = await Dasht33.findByIdAndUpdate(
      id,
      { size, gender, color, design, price },
      { new: true }
    );

    if (!updatedDasht33) {
      return res.status(404).json({ message: 'Dasht33 not found' });
    }

    // Send a response with the updated Dasht33
    res.status(200).json({ dasht33: updatedDasht33 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a specific Dasht33 by ID
export const deleteDasht33ById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the Dasht33 by ID
    const deletedDasht33 = await Dasht33.findByIdAndDelete(id);

    if (!deletedDasht33) {
      return res.status(404).json({ message: 'Dasht33 not found' });
    }

    // Send a response with the deleted Dasht33
    res.status(200).json({ dasht33: deletedDasht33 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
