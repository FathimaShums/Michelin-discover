import React, { useState, useEffect, useCallback } from 'react';
import { fetchRestaurants, fetchFilterOptions } from './api/restaurants';
import { ShortlistProvider, useShortlist } from './context/ShortlistContext';
import SearchFilterBar from './components/SearchFilterBar';
import RestaurantGrid from './components/RestaurantGrid';
import MapView from './components/MapView';
import RestaurantDetail from './components/RestaurantDetail';
import ShortlistDrawer from './components/ShortlistDrawer';
import { Utensils, Map, Grid, Heart, Sparkles } from 'lucide-react';

function MainApp() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [restaurants, setRestaurants] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({ cuisines: [], countries: [], awards: [], priceTiers: [1, 2, 3, 4] });

  // Active filters state
  const [filters, setFilters] = useState({
    search: '',
    cuisine: [],
    priceTier: [],
    award: '',
    country: '',
    greenStar: false,
    page: 1,
    limit: 48
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { shortlistIds, toggleShortlist, isShortlisted, count: shortlistCount } = useShortlist();

  // Initial metadata options fetch
  useEffect(() => {
    fetchFilterOptions()
      .then(setFilterOptions)
      .catch((err) => console.error('Error loading metadata:', err));
  }, []);

  // Fetch restaurants when filters or page change
  const loadRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRestaurants(filters);
      setRestaurants(data.restaurants || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      cuisine: [],
      priceTier: [],
      award: '',
      country: '',
      greenStar: false,
      page: 1,
      limit: 48
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 border-b border-slate-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Utensils className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
                Michelin Discover
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  2021 Guide
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Explore 19,000+ Michelin Guide Restaurants</p>
            </div>
          </div>

          {/* Controls: View Toggle & Shortlist Drawer */}
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Map className="w-4 h-4" />
                Map View
              </button>
            </div>

            {/* Shortlist Drawer Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-medium text-xs shadow-lg shadow-rose-900/30 transition-all active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Shortlist</span>
              {shortlistCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-rose-600 font-bold text-[11px] flex items-center justify-center ml-1">
                  {shortlistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <SearchFilterBar
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          options={filterOptions}
        />

        {/* View Component: Grid or Map */}
        {viewMode === 'grid' ? (
          <RestaurantGrid
            restaurants={restaurants}
            total={total}
            page={page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))}
            onSelectRestaurant={setSelectedRestaurant}
            shortlistIds={shortlistIds}
            onToggleShortlist={toggleShortlist}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <MapView
            restaurants={restaurants}
            onSelectRestaurant={setSelectedRestaurant}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0B0F19] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Michelin Discover Explorer. Data sourced from Michelin Guide 2021 dataset.</p>
          <p className="text-slate-400">React + Express + MongoDB Monorepo</p>
        </div>
      </footer>

      {/* Restaurant Detail Modal */}
      {selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          isShortlisted={isShortlisted(selectedRestaurant.id)}
          onToggleShortlist={toggleShortlist}
          onSelectSimilar={(sim) => setSelectedRestaurant(sim)}
        />
      )}

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectRestaurant={setSelectedRestaurant}
      />
    </div>
  );
}

export default function App() {
  return (
    <ShortlistProvider>
      <MainApp />
    </ShortlistProvider>
  );
}
