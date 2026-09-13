import React from 'react';
import { X, Trash2, Heart, MapPin } from 'lucide-react';
import { useShortlist } from '../context/ShortlistContext';

export default function ShortlistDrawer({ isOpen, onClose, onSelectRestaurant }) {
  const { shortlist, toggleShortlist, clearShortlist, count } = useShortlist();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel — slides in from right */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-screen max-w-md flex flex-col bg-slate-900 border-l border-slate-800 shadow-2xl text-slate-100 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
              Saved Shortlist
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {count}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {count > 0 && (
              <button
                onClick={clearShortlist}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {shortlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-1">No saved restaurants</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Tap the heart on any card to bookmark restaurants you want to visit.
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
                className="group bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 active:scale-[0.98]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      {restaurant.award || 'Michelin'}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {restaurant.price || '$'.repeat(restaurant.priceTier || 2)}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate"
                      style={{ fontFamily: 'var(--font-serif)' }}>
                    {restaurant.name}
                  </h4>

                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="truncate">{restaurant.city}, {restaurant.country}</span>
                  </p>

                  {restaurant.cuisines?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {restaurant.cuisines.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 border border-slate-700/50">
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
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all shrink-0 mt-0.5"
                  title="Remove from shortlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
