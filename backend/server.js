const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurants');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/michelin';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/restaurants', restaurantRoutes); // Alias for flexible base path

// Healthcheck route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Michelin Discover API Server',
    endpoints: {
      restaurants: '/api/restaurants',
      restaurantById: '/api/restaurants/:id',
      similarRestaurants: '/api/restaurants/:id/similar',
      metadataOptions: '/api/restaurants/metadata/options'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server function (supports testing export)
let server;
const startServer = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    server = app.listen(PORT, () => {
      console.log(`Michelin Discover API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, startServer };
