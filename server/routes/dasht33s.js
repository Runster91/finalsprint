const express = require('express');
const router = express.Router();
const Dasht33 = require('../models/Dasht33'); // Assuming you have a Dasht33 model

// Get a single product by ID
router.get('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Dasht33.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Dasht33 not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a list of products
router.get('/products', async (req, res) => {
  try {
    const products = await Dasht33.find();

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
