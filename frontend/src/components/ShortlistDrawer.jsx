import React from 'react';
import { X, Trash2, Heart, ExternalLink, MapPin, Utensils } from 'lucide-react';
import { useShortlist } from '../context/ShortlistContext';

export default function ShortlistDrawer({ isOpen, onClose, onSelectRestaurant }) {
  const { shortlist, toggleShortlist, clearShortlist, count } = useShortlist();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
          {/* Header */}
          <div className="p-5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-lg font-serif font-bold text-white">Your Saved Shortlist</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {count}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {count > 0 && (
                <button
                  onClick={clearShortlist}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Clear all shortlisted items"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {shortlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200 mb-1">No Saved Restaurants</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Click the heart icon on any restaurant card to bookmark your favorite Michelin dining spots.
                </p>
              </div>
            ) : (
              shortlist.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => {
                    onSelectRestaurant && onSelectRestaurant(restaurant);
                    onClose();
                  }}
                  className="group bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 cursor-pointer transition-all duration-200 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        {restaurant.award || 'Michelin'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {restaurant.price || '$'.repeat(restaurant.priceTier || 2)}
                      </span>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                      {restaurant.name}
                    </h4>

                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      {restaurant.city}, {restaurant.country}
                    </p>

                    {restaurant.cuisines?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {restaurant.cuisines.slice(0, 2).map((c, i) => (
                          <span key={i} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShortlist(restaurant);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all shrink-0"
                    title="Remove from shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
