// controllers/checkoutController.js

import stripe from 'stripe';
import dotenv from 'dotenv';
import User from './../models/User.js';
import Cart from './../models/Cart.js';

dotenv.config();

const stripeKey = stripe(process.env.STRIPE_SECRET_KEY);

// Calculate the total amount to charge based on items in the cart
const calculateTotalAmount = (items) => {
  let totalAmount = 0;

  items.forEach((item) => {
    totalAmount += item.price; // Assuming each item has a "price" property
  });

  return totalAmount;
};

// Create a checkout session for Stripe
export const createCheckoutSession = async (req, res) => {
  try {
    const userID = req.user.id;

    const foundUser = await User.findById(userID).lean();

    const foundCart = await Cart.findById(foundUser.cart).lean().populate();

    const line_items = foundCart.products.map((productToBuy) => {
      return {
        price: productToBuy.priceID,
        quantity: productToBuy.quantity,
      };
    });

    const session = await stripeKey.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/?status=successful`,
      cancel_url: `${process.env.FRONTEND_URL}/carrito?status=unsuccessful`,
      customer_email: foundUser.email,
    });

    res.status(200).json({
      msg: 'Access this link for the payment session',
      session_url: session.url,
      session,
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      msg: 'There was a problem',
      error,
    });
  }
};

// Create an order based on Stripe webhook data
export const createOrder = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WH_SIGNING_SECRET;

    let event = stripeKey.webhooks.constructEvent(req.body, sig, endpointSecret);

    switch (event.type) {
      case 'charge.succeeded':
        const paymentIntent = event.data.object;
        const email = paymentIntent.billing_details.email;
        const receiptURL = paymentIntent.receipt_url;
        const receiptID = receiptURL.split('/').filter((item) => item).pop();
        const amount = paymentIntent.amount;
        const date_created = paymentIntent.created;

        const paymentDB = await User.findOneAndUpdate(
          { email },
          {
            $push: {
              receipts: {
                receiptURL,
                receiptID,
                date_created,
                amount,
              },
            },
          },
          { new: true }
        ).lean();

        res.status(200).json({
          msg: 'Data updated successfully. Payment successful.',
        });

        break;

      default:
        console.log('Event without match.');
        res.status(200).json({
          msg: 'Event without match',
        });
    }

    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'There was a problem generating receipts for the user.',
    });
  }
};

// Edit the user's cart
export const editCart = async (req, res) => {
  const userID = req.user.id;

  try {
    const foundUser = await User.findById(userID).lean();
    const { products } = req.body;

    const updatedCart = await Cart.findByIdAndUpdate(
      foundUser.cart,
      { products },
      { new: true }
    );

    res.status(200).json({
      msg: 'Cart updated',
      updatedCart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'There was a server error',
      error,
    });
  }
};

// Get the user's cart
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const foundUser = await User.findOne({ _id: userId });
    const foundCart = await Cart.findOne({ _id: foundUser.cart });

    return res.status(200).json({
      msg: 'Cart found successfully',
      cart: foundCart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'There was a server error',
      error,
    });
  }
};
