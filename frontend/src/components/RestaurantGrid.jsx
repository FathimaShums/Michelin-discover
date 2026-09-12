import React from 'react';
import RestaurantCard from './RestaurantCard';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RestaurantGrid({
  restaurants = [],
  total = 0,
  page = 1,
  totalPages = 1,
  loading = false,
  onPageChange,
  onSelectRestaurant,
  shortlistIds = [],
  onToggleShortlist,
  onResetFilters
}) {
  if (loading) {
    return <LoadingSkeleton count={8} />;
  }

  if (!restaurants || restaurants.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-amber-400 font-semibold">{restaurants.length}</strong> of{' '}
          <strong className="text-slate-200 font-semibold">{total.toLocaleString()}</strong> Michelin guide restaurants
        </span>
        <span>
          Page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong>
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id || restaurant._id}
            restaurant={restaurant}
            onClick={onSelectRestaurant}
            isShortlisted={shortlistIds.includes(restaurant.id)}
            onToggleShortlist={onToggleShortlist}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium border border-slate-700 transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium border border-slate-700 transition-all active:scale-95"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
