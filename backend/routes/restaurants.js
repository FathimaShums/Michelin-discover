const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Helper to escape special regex characters from user input to prevent ReDoS / syntax errors
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * GET /api/restaurants/metadata/options
 * Returns unique cuisine list, country list, awards, and price tiers for filter dropdowns
 */
router.get('/metadata/options', async (req, res) => {
  try {
    const cuisines = await Restaurant.distinct('cuisines');
    const countries = await Restaurant.distinct('country');
    const awards = await Restaurant.distinct('award');
    const priceTiers = [1, 2, 3, 4];

    res.json({
      cuisines: cuisines.filter(Boolean).sort(),
      countries: countries.filter(Boolean).sort(),
      awards: awards.filter(Boolean).sort(),
      priceTiers
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch filter metadata' });
  }
});

/**
 * GET /api/restaurants
 * Query params: cuisine, priceTier, award, country, greenStar, search, page, limit
 */
router.get('/', async (req, res) => {
  try {
    const { cuisine, priceTier, award, country, greenStar, search, page = 1, limit = 50 } = req.query;

    const query = {};

    // Filter by Cuisine (support comma-separated or array)
    if (cuisine) {
      const cuisineList = Array.isArray(cuisine)
        ? cuisine
        : cuisine.split(',').map((c) => c.trim()).filter(Boolean);
      if (cuisineList.length > 0) {
        query.cuisines = { $in: cuisineList.map((c) => new RegExp(`^${escapeRegex(c)}$`, 'i')) };
      }
    }

    // Filter by Price Tier (support comma-separated numbers)
    if (priceTier) {
      const tiers = (Array.isArray(priceTier) ? priceTier : priceTier.split(','))
        .map((p) => parseInt(p, 10))
        .filter((p) => !isNaN(p));
      if (tiers.length > 0) {
        query.priceTier = { $in: tiers };
      }
    }

    // Filter by Award
    if (award) {
      const awardList = Array.isArray(award)
        ? award
        : award.split(',').map((a) => a.trim()).filter(Boolean);
      if (awardList.length > 0) {
        query.award = { $in: awardList };
      }
    }

    // Filter by Country
    if (country && country.trim() !== '') {
      query.country = new RegExp(`^${escapeRegex(country.trim())}$`, 'i');
    }

    // Filter by Green Star
    if (greenStar !== undefined && greenStar !== '') {
      query.greenStar = greenStar === 'true' || greenStar === '1' || greenStar === true;
    }

    // Text search by name, city, or description
    if (search && search.trim() !== '') {
      const escaped = escapeRegex(search.trim());
      const searchRegex = new RegExp(escaped, 'i');
      query.$or = [
        { name: searchRegex },
        { city: searchRegex },
        { country: searchRegex },
        { cuisines: searchRegex }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [restaurants, total] = await Promise.all([
      Restaurant.find(query).sort({ award: -1, name: 1 }).skip(skip).limit(limitNum).lean(),
      Restaurant.countDocuments(query)
    ]);

    res.json({
      restaurants,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

/**
 * GET /api/restaurants/:id/similar
 * Similarity score: +2 for each overlapping cuisine, +1 for same price tier, +1 for same country.
 * Returns top 4 restaurants excluding target restaurant.
 */
router.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;

    // Find target restaurant by custom id or _id
    const target = await Restaurant.findOne({
      $or: [{ id: id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
    }).lean();

    if (!target) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Fetch candidate pool matching at least one attribute (country, priceTier, or any cuisine)
    const candidates = await Restaurant.find({
      id: { $ne: target.id },
      $or: [
        { country: target.country },
        { priceTier: target.priceTier },
        { cuisines: { $in: target.cuisines || [] } }
      ]
    }).limit(200).lean();

    // If candidate pool is small, fall back to fetching other restaurants
    let pool = candidates;
    if (pool.length < 4) {
      pool = await Restaurant.find({ id: { $ne: target.id } }).limit(100).lean();
    }

    // Calculate similarity score for each candidate
    const scoredCandidates = pool.map((candidate) => {
      let score = 0;

      // +2 for each overlapping cuisine
      if (target.cuisines && candidate.cuisines) {
        const targetCuisinesLower = target.cuisines.map((c) => c.toLowerCase());
        candidate.cuisines.forEach((c) => {
          if (targetCuisinesLower.includes(c.toLowerCase())) {
            score += 2;
          }
        });
      }

      // +1 for same price tier
      if (target.priceTier && candidate.priceTier && target.priceTier === candidate.priceTier) {
        score += 1;
      }

      // +1 for same country
      if (target.country && candidate.country && target.country.toLowerCase() === candidate.country.toLowerCase()) {
        score += 1;
      }

      return {
        ...candidate,
        similarityScore: score
      };
    });

    // Sort by similarity score descending, then by name
    scoredCandidates.sort((a, b) => b.similarityScore - a.similarityScore || a.name.localeCompare(b.name));

    // Return top 4
    const top4 = scoredCandidates.slice(0, 4);

    res.json(top4);
  } catch (error) {
    console.error('Error fetching similar restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch similar restaurants' });
  }
});

/**
 * GET /api/restaurants/:id
 * Single restaurant details by id or _id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      $or: [{ id: id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
    }).lean();

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

module.exports = router;
