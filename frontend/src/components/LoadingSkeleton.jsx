import React from 'react';

export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between animate-pulse h-80"
        >
          <div>
            {/* Header badges skeleton */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-24 bg-slate-800 rounded-full" />
              <div className="h-6 w-12 bg-slate-800 rounded-full" />
            </div>

            {/* Title & subtitle skeleton */}
            <div className="h-6 w-3/4 bg-slate-800 rounded mb-2" />
            <div className="h-4 w-1/2 bg-slate-800/60 rounded mb-6" />

            {/* Cuisines skeleton */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-5 w-16 bg-slate-800/70 rounded-md" />
              <div className="h-5 w-20 bg-slate-800/70 rounded-md" />
              <div className="h-5 w-14 bg-slate-800/70 rounded-md" />
            </div>
          </div>

          {/* Footer skeleton */}
          <div className="pt-4 border-t border-slate-800/60 flex justify-between items-center">
            <div className="h-4 w-28 bg-slate-800/60 rounded" />
            <div className="h-8 w-8 bg-slate-800 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
