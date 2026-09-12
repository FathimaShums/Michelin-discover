import React from 'react';
import { Utensils, RotateCcw } from 'lucide-react';

export default function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-slate-800/80 rounded-2xl bg-slate-900/40 backdrop-blur-md">
      <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 text-amber-400 shadow-lg shadow-amber-500/10">
        <Utensils className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-serif font-bold text-slate-100 mb-2">No Restaurants Found</h3>
      <p className="text-slate-400 max-w-md mb-6 text-sm">
        We couldn't find any Michelin guide restaurants matching your selected filter criteria. Try adjusting your search query, price range, or cuisine selection.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-900/20 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Filters
        </button>
      )}
    </div>
  );
}
