const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      index: true
    },
    address: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      index: true,
      default: ''
    },
    country: {
      type: String,
      index: true,
      default: ''
    },
    price: {
      type: String,
      default: null
    },
    priceTier: {
      type: Number,
      index: true,
      default: null
    },
    cuisines: {
      type: [String],
      index: true,
      default: []
    },
    longitude: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    phoneNumber: {
      type: String,
      default: null
    },
    websiteUrl: {
      type: String,
      default: null
    },
    award: {
      type: String,
      index: true,
      default: 'Selected Restaurants'
    },
    greenStar: {
      type: Boolean,
      index: true,
      default: false
    },
    facilitiesAndServices: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound text index for fast search queries across name, city, and description
restaurantSchema.index({ name: 'text', city: 'text', country: 'text', description: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
