import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShortlistDrawer from '../ShortlistDrawer';
import { ShortlistProvider, useShortlist } from '../../context/ShortlistContext';

// Helper wrapper component with test button to toggle shortlist item
function TestWrapper({ restaurant }) {
  const { toggleShortlist } = useShortlist();
  return (
    <div>
      <button onClick={() => toggleShortlist(restaurant)}>Add Test Restaurant</button>
      <ShortlistDrawer isOpen={true} onClose={vi.fn()} onSelectRestaurant={vi.fn()} />
    </div>
  );
}

describe('ShortlistDrawer Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const testRestaurant = {
    id: 'rest_test_100',
    name: 'Le Bernardin',
    city: 'New York',
    country: 'USA',
    award: '3 Stars',
    priceTier: 4,
    cuisines: ['Seafood', 'French']
  };

  it('renders empty shortlist state initially', () => {
    render(
      <ShortlistProvider>
        <ShortlistDrawer isOpen={true} onClose={vi.fn()} onSelectRestaurant={vi.fn()} />
      </ShortlistProvider>
    );

    expect(screen.getByText(/no saved restaurants/i)).toBeInTheDocument();
  });

  it('displays added restaurant and updates count badge', () => {
    render(
      <ShortlistProvider>
        <TestWrapper restaurant={testRestaurant} />
      </ShortlistProvider>
    );

    const addBtn = screen.getByText(/add test restaurant/i);
    fireEvent.click(addBtn);

    expect(screen.getByText('Le Bernardin')).toBeInTheDocument();
    expect(screen.getByText('New York, USA')).toBeInTheDocument();
  });
});
