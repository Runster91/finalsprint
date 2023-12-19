const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart'); // Import the Cart model
const { authenticateToken } = require('../middleware/authorizations.js');
 // Import the authentication middleware

// Define a route for creating a payment intent and updating the cart
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    // Get the authenticated user's ID from the token
    const userId = req.user.userId;

    // Retrieve the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('products.product');

    // Calculate the total amount to charge based on items in the cart
    let totalAmount = 0;
    cart.products.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd', // Change to your desired currency
    });

    // Send the client secret of the payment intent to the frontend
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
