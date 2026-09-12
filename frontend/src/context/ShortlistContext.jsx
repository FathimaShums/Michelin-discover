import React, { createContext, useContext, useState, useEffect } from 'react';

const ShortlistContext = createContext();

const STORAGE_KEY = 'michelin_discover_shortlist';

export function ShortlistProvider({ children }) {
  const [shortlist, setShortlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to read shortlist from localStorage:', err);
      return [];
    }
  });

  // Sync state to localStorage whenever shortlist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shortlist));
    } catch (err) {
      console.error('Failed to save shortlist to localStorage:', err);
    }
  }, [shortlist]);

  // Toggle restaurant in shortlist
  const toggleShortlist = (restaurant) => {
    setShortlist((prev) => {
      const exists = prev.some((item) => item.id === restaurant.id);
      if (exists) {
        return prev.filter((item) => item.id !== restaurant.id);
      } else {
        return [...prev, restaurant];
      }
    });
  };

  // Check if restaurant is shortlisted
  const isShortlisted = (id) => {
    return shortlist.some((item) => item.id === id);
  };

  // Clear entire shortlist
  const clearShortlist = () => {
    setShortlist([]);
  };

  const shortlistIds = shortlist.map((item) => item.id);

  return (
    <ShortlistContext.Provider
      value={{
        shortlist,
        shortlistIds,
        toggleShortlist,
        isShortlisted,
        clearShortlist,
        count: shortlist.length
      }}
    >
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (!context) {
    throw new Error('useShortlist must be used within a ShortlistProvider');
  }
  return context;
}
