const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch filter options (cuisines, countries, awards, priceTiers)
 */
export async function fetchFilterOptions() {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants/metadata/options`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch filter options:', err);
    return { cuisines: [], countries: [], awards: [], priceTiers: [1, 2, 3, 4] };
  }
}

/**
 * Fetch list of restaurants matching search filters and pagination
 */
export async function fetchRestaurants(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.cuisine && filters.cuisine.length > 0) {
      params.append('cuisine', Array.isArray(filters.cuisine) ? filters.cuisine.join(',') : filters.cuisine);
    }
    if (filters.priceTier && filters.priceTier.length > 0) {
      params.append('priceTier', Array.isArray(filters.priceTier) ? filters.priceTier.join(',') : filters.priceTier);
    }
    if (filters.award) {
      params.append('award', filters.award);
    }
    if (filters.country) {
      params.append('country', filters.country);
    }
    if (filters.greenStar !== undefined && filters.greenStar !== null && filters.greenStar !== '') {
      params.append('greenStar', filters.greenStar);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.limit) {
      params.append('limit', filters.limit);
    }

    const res = await fetch(`${API_BASE_URL}/restaurants?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch restaurants:', err);
    throw err;
  }
}

/**
 * Fetch single restaurant details by ID
 */
export async function fetchRestaurantById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch restaurant ${id}:`, err);
    throw err;
  }
}

/**
 * Fetch top 4 similar restaurants for a given restaurant ID
 */
export async function fetchSimilarRestaurants(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants/${id}/similar`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch similar restaurants for ${id}:`, err);
    return [];
  }
}
