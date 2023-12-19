const mongoose = require('mongoose');

function connectToDatabase() {
  const connectionString = 'mongodb://localhost:27017/DASHUN1T3'; // Replace with your MongoDB connection string
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
}

module.exports = connectToDatabase;
