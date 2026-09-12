import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';
import Restaurant from '../models/Restaurant.js';

// Sample fixture of 6 restaurants
const sampleRestaurants = [
  {
    id: 'rest_test_1',
    name: 'Le Calandre',
    city: 'Rovigo',
    country: 'Italy',
    price: '$$$$',
    priceTier: 4,
    cuisines: ['Italian', 'Creative'],
    longitude: 11.88,
    latitude: 45.38,
    award: '3 Stars',
    greenStar: false,
    facilitiesAndServices: ['Air conditioning'],
    description: 'Outstanding Italian cuisine'
  },
  {
    id: 'rest_test_2',
    name: 'Osteria Francescana',
    city: 'Modena',
    country: 'Italy',
    price: '$$$$',
    priceTier: 4,
    cuisines: ['Italian', 'Modern'],
    longitude: 10.92,
    latitude: 44.64,
    award: '3 Stars',
    greenStar: true,
    facilitiesAndServices: ['Interesting wine list'],
    description: 'Iconic Italian gastronomy'
  },
  {
    id: 'rest_test_3',
    name: 'Noma',
    city: 'Copenhagen',
    country: 'Denmark',
    price: '$$$$',
    priceTier: 4,
    cuisines: ['Nordic', 'Creative'],
    longitude: 12.60,
    latitude: 55.68,
    award: '3 Stars',
    greenStar: true,
    facilitiesAndServices: ['Terrace'],
    description: 'Reinvented Nordic gastronomy'
  },
  {
    id: 'rest_test_4',
    name: 'Trattoria da Enzo',
    city: 'Rome',
    country: 'Italy',
    price: '$$',
    priceTier: 2,
    cuisines: ['Italian', 'Traditional'],
    longitude: 12.48,
    latitude: 41.89,
    award: 'Bib Gourmand',
    greenStar: false,
    facilitiesAndServices: [],
    description: 'Hearty traditional Roman pasta'
  },
  {
    id: 'rest_test_5',
    name: 'Sushi Saito',
    city: 'Tokyo',
    country: 'Japan',
    price: '$$$$',
    priceTier: 4,
    cuisines: ['Japanese', 'Sushi'],
    longitude: 139.74,
    latitude: 35.66,
    award: '3 Stars',
    greenStar: false,
    facilitiesAndServices: ['Counter dining'],
    description: 'Masterful sushi in Tokyo'
  },
  {
    id: 'rest_test_6',
    name: 'Bistro du Vin',
    city: 'Paris',
    country: 'France',
    price: '$$',
    priceTier: 2,
    cuisines: ['French', 'Traditional'],
    longitude: 2.35,
    latitude: 48.85,
    award: '1 Star',
    greenStar: false,
    facilitiesAndServices: ['Wine bar'],
    description: 'Classic French bistro'
  }
];

describe('Michelin Discover API Routes', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/michelin_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await Restaurant.deleteMany({});
    await Restaurant.insertMany(sampleRestaurants);
  });

  afterAll(async () => {
    await Restaurant.deleteMany({});
    await mongoose.disconnect();
  });

  describe('GET /api/restaurants', () => {
    it('should return all restaurants when no query params are provided', async () => {
      const res = await request(app).get('/api/restaurants');
      expect(res.status).toBe(200);
      expect(res.body.restaurants).toHaveLength(6);
      expect(res.body.total).toBe(6);
    });

    it('should filter by country accurately', async () => {
      const res = await request(app).get('/api/restaurants?country=Italy');
      expect(res.status).toBe(200);
      expect(res.body.restaurants).toHaveLength(3);
      expect(res.body.restaurants.every((r) => r.country === 'Italy')).toBe(true);
    });

    it('should filter by cuisine accurately', async () => {
      const res = await request(app).get('/api/restaurants?cuisine=Creative');
      expect(res.status).toBe(200);
      expect(res.body.restaurants).toHaveLength(2);
      const names = res.body.restaurants.map((r) => r.name);
      expect(names).toContain('Le Calandre');
      expect(names).toContain('Noma');
    });

    it('should filter by price tier accurately', async () => {
      const res = await request(app).get('/api/restaurants?priceTier=2');
      expect(res.status).toBe(200);
      expect(res.body.restaurants).toHaveLength(2);
      expect(res.body.restaurants.every((r) => r.priceTier === 2)).toBe(true);
    });

    it('should filter by award accurately', async () => {
      const res = await request(app).get('/api/restaurants?award=Bib Gourmand');
      expect(res.status).toBe(200);
      expect(res.body.restaurants).toHaveLength(1);
      expect(res.body.restaurants[0].name).toBe('Trattoria da Enzo');
    });

    it('should filter by GreenStar boolean', async () => {
      const res = await request(app).get('/api/restaurants?greenStar=true');
      expect(res.status).toBe(200);
      expect(res.body.restaurants).toHaveLength(2);
      expect(res.body.restaurants.every((r) => r.greenStar === true)).toBe(true);
    });

    it('should combine multiple filter query params', async () => {
      const res = await request(app).get('/api/restaurants?country=Italy&priceTier=4&cuisine=Italian');
      expect(res.status).toBe(200);
      expect(res.body.restaurants).toHaveLength(2);
    });
  });

  describe('GET /api/restaurants/:id', () => {
    it('should return a single restaurant by custom id', async () => {
      const res = await request(app).get('/api/restaurants/rest_test_3');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Noma');
      expect(res.body.country).toBe('Denmark');
    });

    it('should return 404 for non-existent restaurant id', async () => {
      const res = await request(app).get('/api/restaurants/rest_non_existent');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/restaurants/:id/similar', () => {
    it('should compute similarity scores correctly and return top candidates', async () => {
      // For Le Calandre (rest_test_1):
      // - Country: Italy, PriceTier: 4, Cuisines: ['Italian', 'Creative']
      // Osteria Francescana (rest_test_2): same country (+1), same price (+1), overlapping cuisines 'Italian' (+2) -> Score = 4
      // Trattoria da Enzo (rest_test_4): same country (+1), overlapping cuisine 'Italian' (+2) -> Score = 3
      // Noma (rest_test_3): same price (+1), overlapping cuisine 'Creative' (+2) -> Score = 3
      const res = await request(app).get('/api/restaurants/rest_test_1/similar');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(4);
      expect(res.body[0].name).toBe('Osteria Francescana');
      expect(res.body[0].similarityScore).toBe(4);
    });
  });
});
