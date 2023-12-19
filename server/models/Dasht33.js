// models/Dasht33.js

const mongoose = require('mongoose');

const dasht33Schema = new mongoose.Schema({
  size: {
    type: String, // You can choose an appropriate data type (e.g., Small, Medium, Large)
    required: true,
  },
  gender: {
    type: String, // You can choose an appropriate data type (e.g., Men, Women, Unisex)
    required: true,
  },
  color: {
    type: String, // You can choose an appropriate data type (e.g., Red, Blue, Green)
    required: true,
  },
  design: {
    type: String, // You can choose an appropriate data type (e.g., Graphic, Logo, Plain)
    required: true,
  },
  price: {
    type: Number, // You can choose an appropriate data type (e.g., Decimal for currency)
    required: true,
  },
});

const Dasht33 = mongoose.model('Dasht33', dasht33Schema);

module.exports = Dasht33;
