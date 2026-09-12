import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchFilterBar from '../SearchFilterBar';

describe('SearchFilterBar Component', () => {
  const mockOptions = {
    cuisines: ['Italian', 'French', 'Japanese'],
    countries: ['Italy', 'France', 'Japan'],
    awards: ['3 Stars', '2 Stars', '1 Star', 'Bib Gourmand'],
    priceTiers: [1, 2, 3, 4]
  };

  const defaultFilters = {
    search: '',
    cuisine: [],
    priceTier: [],
    award: '',
    country: '',
    greenStar: false
  };

  it('renders search input and dropdown filter options correctly', () => {
    render(
      <SearchFilterBar
        filters={defaultFilters}
        onChange={vi.fn()}
        onReset={vi.fn()}
        options={mockOptions}
      />
    );

    expect(
      screen.getByPlaceholderText(/search by restaurant name, city, or cuisine/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/all distinction awards/i)).toBeInTheDocument();
    expect(screen.getByText(/all countries/i)).toBeInTheDocument();
  });

  it('triggers onChange when award dropdown option is selected', () => {
    const handleChange = vi.fn();
    render(
      <SearchFilterBar
        filters={defaultFilters}
        onChange={handleChange}
        onReset={vi.fn()}
        options={mockOptions}
      />
    );

    const awardSelect = screen.getByRole('combobox', { name: /michelin award/i });
    fireEvent.change(awardSelect, { target: { value: '3 Stars' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ award: '3 Stars' })
    );
  });

  it('triggers onChange when Green Star sustainability button is clicked', () => {
    const handleChange = vi.fn();
    render(
      <SearchFilterBar
        filters={defaultFilters}
        onChange={handleChange}
        onReset={vi.fn()}
        options={mockOptions}
      />
    );

    const greenStarBtn = screen.getByText(/green star only/i);
    fireEvent.click(greenStarBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ greenStar: true })
    );
  });
});
