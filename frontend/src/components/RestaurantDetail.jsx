import React, { useState, useEffect } from 'react';
import { X, Star, Leaf, MapPin, Phone, Globe, ExternalLink, Sparkles, Heart, Utensils } from 'lucide-react';
import { fetchSimilarRestaurants } from '../api/restaurants';

export default function RestaurantDetail({ restaurant, onClose, isShortlisted, onToggleShortlist, onSelectSimilar }) {
  const [similarList, setSimilarList] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const {
    id,
    name,
    address,
    location,
    city,
    country,
    price,
    priceTier,
    cuisines = [],
    award,
    greenStar,
    facilitiesAndServices = [],
    description,
    phoneNumber,
    websiteUrl
  } = restaurant;

  // Load similar restaurants whenever target restaurant changes
  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoadingSimilar(true);

    fetchSimilarRestaurants(id)
      .then((data) => {
        if (isMounted) {
          setSimilarList(data);
          setLoadingSimilar(false);
        }
      })
      .catch((err) => {
        console.error('Error loading similar restaurants:', err);
        if (isMounted) setLoadingSimilar(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const displayPrice = price || (priceTier ? '$'.repeat(priceTier) : '$$');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-y-auto flex flex-col text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Gradient hero header ───────────────────────── */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-6 pb-5">
            {/* Top action row */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {award || 'Michelin Guide'}
                </span>
                {greenStar && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    Green Star
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleShortlist && onToggleShortlist(restaurant)}
                  className={`p-2.5 rounded-full border transition-all ${
                    isShortlisted
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-md shadow-rose-500/20'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-rose-400 hover:bg-slate-700'
                  }`}
                  title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                >
                  <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-rose-500' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Restaurant name + price in the hero */}
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                {name}
              </h2>
              <span className="text-xl font-semibold text-amber-400 tracking-widest shrink-0">{displayPrice}</span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{address || `${city}, ${country}`}</span>
            </div>

            {cuisines.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {cuisines.map((c, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-amber-200 border border-slate-700/80">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom divider gradient */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>

        {/* Content Body — name/location/cuisines are now in the hero above */}
        <div className="p-6 space-y-8">

          {/* Description Box */}
          {description && (
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Guide Inspector's Review</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-sans">{description}</p>
            </div>
          )}

          {/* Contact & Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Details */}
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contact & Reservation</h3>

              {phoneNumber ? (
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex items-center gap-3 text-sm text-slate-200 hover:text-amber-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{phoneNumber}</span>
                </a>
              ) : (
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>Phone unavailable</span>
                </div>
              )}

              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-600/20 to-rose-600/20 hover:from-amber-600/30 hover:to-rose-600/30 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Official Website
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : null}
            </div>

            {/* Facilities & Services */}
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Facilities & Amenities</h3>
              {facilitiesAndServices.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {facilitiesAndServices.map((fac, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No facility details listed.</p>
              )}
            </div>
          </div>

          {/* Similar Restaurants Section */}
          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-serif font-bold text-white">You Might Also Like</h3>
            </div>

            {loadingSimilar ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 bg-slate-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : similarList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarList.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectSimilar && onSelectSimilar(sim)}
                    className="group bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 mb-2 inline-block">
                      {sim.award || 'Michelin'}
                    </span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {sim.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                      {sim.city}, {sim.country}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{sim.cuisines?.[0] || 'Cuisine'}</span>
                      <span className="text-amber-400 font-semibold">{sim.price || '$'.repeat(sim.priceTier || 2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No similar recommendations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
