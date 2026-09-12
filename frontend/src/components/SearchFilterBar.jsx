import React, { useState, useEffect } from 'react';
import { Search, Filter, Leaf, RotateCcw, ChevronDown, Check, X, Sparkles } from 'lucide-react';

export default function SearchFilterBar({
  filters,
  onChange,
  onReset,
  options = { cuisines: [], countries: [], awards: [], priceTiers: [1, 2, 3, 4] }
}) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isCuisineOpen, setIsCuisineOpen] = useState(false);

  // Sync internal search input state with parent filter prop
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Handle debounced search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || '')) {
        onChange({ ...filters, search: searchInput, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Cuisine multi-select toggle
  const toggleCuisine = (cuisine) => {
    const current = filters.cuisine || [];
    const updated = current.includes(cuisine)
      ? current.filter((c) => c !== cuisine)
      : [...current, cuisine];
    onChange({ ...filters, cuisine: updated, page: 1 });
  };

  // Price tier multi-select toggle
  const togglePriceTier = (tier) => {
    const current = filters.priceTier || [];
    const updated = current.includes(tier)
      ? current.filter((t) => t !== tier)
      : [...current, tier];
    onChange({ ...filters, priceTier: updated, page: 1 });
  };

  // Count active filters
  const activeFilterCount =
    (filters.cuisine?.length || 0) +
    (filters.priceTier?.length || 0) +
    (filters.country ? 1 : 0) +
    (filters.award ? 1 : 0) +
    (filters.greenStar ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl mb-8">
      {/* Top Search Bar Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by restaurant name, city, or cuisine..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition-all"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Reset Filters & Active Badge */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium border border-slate-700 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
        {/* Award Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Michelin Award
          </label>
          <select
            value={filters.award || ''}
            onChange={(e) => onChange({ ...filters, award: e.target.value, page: 1 })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
          >
            <option value="">All Distinction Awards</option>
            <option value="3 Stars">⭐ 3 Michelin Stars</option>
            <option value="2 Stars">⭐ 2 Michelin Stars</option>
            <option value="1 Star">⭐ 1 Michelin Star</option>
            <option value="Bib Gourmand">😋 Bib Gourmand</option>
            <option value="Selected Restaurants">✨ Selected Restaurants</option>
          </select>
        </div>

        {/* Country Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Country / Region
          </label>
          <select
            value={filters.country || ''}
            onChange={(e) => onChange({ ...filters, country: e.target.value, page: 1 })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
          >
            <option value="">All Countries ({options.countries?.length || 0})</option>
            {options.countries?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Price Range
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((tier) => {
              const isSelected = (filters.priceTier || []).includes(tier);
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => togglePriceTier(tier)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md shadow-amber-500/10'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {'$'.repeat(tier)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Green Star Toggle */}
        <div className="flex flex-col justify-end">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Sustainability
          </label>
          <button
            type="button"
            onClick={() => onChange({ ...filters, greenStar: !filters.greenStar, page: 1 })}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
              filters.greenStar
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Leaf className={`w-4 h-4 ${filters.greenStar ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'}`} />
              Green Star Only
            </span>
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                filters.greenStar ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'border-slate-600'
              }`}
            >
              {filters.greenStar ? '✓' : ''}
            </span>
          </button>
        </div>
      </div>

      {/* Cuisine Multi-Select Pills */}
      {options.cuisines?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Popular Cuisines ({filters.cuisine?.length || 0} selected)
            </span>
            {filters.cuisine?.length > 0 && (
              <button
                onClick={() => onChange({ ...filters, cuisine: [], page: 1 })}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Clear cuisines
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {options.cuisines.slice(0, 30).map((c) => {
              const isSelected = (filters.cuisine || []).includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCuisine(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/30 to-rose-500/30 text-amber-200 border-amber-500/60 shadow-sm'
                      : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {c} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
