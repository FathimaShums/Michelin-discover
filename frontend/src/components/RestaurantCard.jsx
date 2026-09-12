import React from 'react';
import { Star, Leaf, MapPin, Heart } from 'lucide-react';

export default function RestaurantCard({ restaurant, onClick, isShortlisted, onToggleShortlist }) {
  const {
    id,
    name,
    city,
    country,
    price,
    priceTier,
    cuisines = [],
    award,
    greenStar
  } = restaurant;

  // Award badge styling helper
  const getAwardStyle = (awardStr) => {
    if (!awardStr) return { bg: 'bg-slate-800 text-slate-300 border-slate-700', label: 'Selected' };

    if (awardStr.includes('3 Star')) {
      return {
        bg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold border-amber-300 shadow-amber-500/20',
        stars: 3,
        label: '3 Michelin Stars'
      };
    }
    if (awardStr.includes('2 Star')) {
      return {
        bg: 'bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-semibold border-amber-400',
        stars: 2,
        label: '2 Michelin Stars'
      };
    }
    if (awardStr.includes('1 Star')) {
      return {
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        stars: 1,
        label: '1 Michelin Star'
      };
    }
    if (awardStr.includes('Bib')) {
      return {
        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        stars: 0,
        label: 'Bib Gourmand'
      };
    }

    return {
      bg: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
      stars: 0,
      label: awardStr
    };
  };

  const awardInfo = getAwardStyle(award);

  // Format price string representation
  const displayPrice = price || (priceTier ? '$'.repeat(priceTier) : '$$');

  return (
    <div
      onClick={() => onClick && onClick(restaurant)}
      className="group relative bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 cursor-pointer overflow-hidden backdrop-blur-md"
    >
      {/* Subtle background glow effect on hover */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all duration-500 pointer-events-none" />

      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border shadow-sm ${awardInfo.bg}`}>
            {awardInfo.stars > 0 ? (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: awardInfo.stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            ) : (
              <Star className="w-3.5 h-3.5" />
            )}
            <span>{awardInfo.label}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Green Star Icon */}
            {greenStar && (
              <span
                title="Michelin Green Star for Sustainability"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              >
                <Leaf className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                <span className="hidden sm:inline">Green Star</span>
              </span>
            )}

            {/* Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleShortlist && onToggleShortlist(restaurant);
              }}
              aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
              className={`p-2 rounded-full border transition-all duration-200 ${
                isShortlisted
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-lg shadow-rose-500/20 scale-105'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-rose-400 hover:bg-slate-700/60'
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform duration-200 ${isShortlisted ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Restaurant Name */}
        <h3 className="text-lg font-serif font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <MapPin className="w-3.5 h-3.5 text-rose-500/80 shrink-0" />
          <span className="line-clamp-1">{city}{country ? `, ${country}` : ''}</span>
        </div>

        {/* Cuisine Tags */}
        {cuisines.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {cuisines.slice(0, 3).map((cuisine, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700/50"
              >
                {cuisine}
              </span>
            ))}
            {cuisines.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/60 text-slate-400 border border-slate-700/40">
                +{cuisines.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Row: Price Tier */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-amber-400 tracking-wider">{displayPrice}</span>
        <span className="group-hover:translate-x-1 text-slate-500 group-hover:text-amber-400 transition-all font-medium flex items-center gap-1">
          View details &rarr;
        </span>
      </div>
    </div>
  );
}
