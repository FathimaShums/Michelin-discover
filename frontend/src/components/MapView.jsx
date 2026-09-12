import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Star, Leaf, ExternalLink, MapPin } from 'lucide-react';

// Create custom colored marker icons for Michelin awards
const createCustomIcon = (award, greenStar) => {
  let color = '#334155'; // default slate
  let iconSymbol = '⭐';

  if (award && award.includes('3 Star')) {
    color = '#D80027'; // Michelin Red
    iconSymbol = '⭐⭐⭐';
  } else if (award && award.includes('2 Star')) {
    color = '#E11D48'; // Bright Rose Red
    iconSymbol = '⭐⭐';
  } else if (award && award.includes('1 Star')) {
    color = '#F59E0B'; // Amber Gold
    iconSymbol = '⭐';
  } else if (award && award.includes('Bib')) {
    color = '#10B981'; // Emerald
    iconSymbol = '😋';
  }

  const html = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #FFFFFF;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    ">
      <div style="
        transform: rotate(45deg);
        color: #FFFFFF;
        font-size: ${award && award.includes('3 Star') ? '8px' : '11px'};
        font-weight: bold;
        text-align: center;
      ">
        ${greenStar ? '🍃' : (award && award.includes('Star') ? '★' : '•')}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-pin',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Component to dynamically fit map bounds when restaurant markers update
function MapBoundsUpdater({ restaurants }) {
  const map = useMap();

  useEffect(() => {
    if (!restaurants || restaurants.length === 0) return;

    const validPoints = restaurants
      .filter((r) => r.latitude && r.longitude && !isNaN(r.latitude) && !isNaN(r.longitude))
      .map((r) => [r.latitude, r.longitude]);

    if (validPoints.length > 0) {
      if (validPoints.length === 1) {
        map.setView(validPoints[0], 13);
      } else {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [restaurants, map]);

  return null;
}

export default function MapView({ restaurants = [], onSelectRestaurant }) {
  const defaultCenter = [48.8566, 2.3522]; // Paris default

  const validRestaurants = restaurants.filter(
    (r) => r.latitude && r.longitude && !isNaN(r.latitude) && !isNaN(r.longitude)
  );

  return (
    <div className="w-full h-[550px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Dark CartoDB / OpenStreetMap tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapBoundsUpdater restaurants={validRestaurants} />

        {validRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id || restaurant._id}
            position={[restaurant.latitude, restaurant.longitude]}
            icon={createCustomIcon(restaurant.award, restaurant.greenStar)}
          >
            <Popup>
              <div className="p-1 min-w-[200px] text-slate-100 font-sans">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {restaurant.award || 'Michelin'}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {restaurant.price || '$'.repeat(restaurant.priceTier || 2)}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-white mb-1 leading-tight">
                  {restaurant.name}
                </h4>

                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  {restaurant.city}, {restaurant.country}
                </p>

                {restaurant.cuisines?.length > 0 && (
                  <p className="text-[11px] text-slate-300 mb-3 italic">
                    {restaurant.cuisines.slice(0, 2).join(', ')}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => onSelectRestaurant && onSelectRestaurant(restaurant)}
                  className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-medium text-xs text-center transition-all shadow-md active:scale-95"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
