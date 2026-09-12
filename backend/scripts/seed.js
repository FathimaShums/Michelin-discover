const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Restaurant = require('../models/Restaurant');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/michelin';

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const dataPath = path.join(__dirname, '..', 'data', 'restaurants.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found at ${dataPath}. Run the data cleaning script first.`);
    }

    console.log(`Reading dataset from ${dataPath}...`);
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const restaurants = JSON.parse(rawData);

    console.log(`Clearing existing restaurants collection...`);
    await Restaurant.deleteMany({});

    console.log(`Inserting ${restaurants.length} restaurants into MongoDB...`);
    // Insert in batches of 2000 for efficiency
    const batchSize = 2000;
    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = restaurants.slice(i, i + batchSize);
      await Restaurant.insertMany(batch);
      console.log(`Seeded batch ${Math.floor(i / batchSize) + 1} (${batch.length} items)...`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedDatabase();
