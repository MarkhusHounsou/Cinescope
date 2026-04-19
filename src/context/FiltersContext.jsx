import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  // Année en cours
  const currentYear = new Date().getFullYear();

  const initialState = {
    genres: [], // IDs de genres sélectionnés
    sortBy: 'popularity.desc',
    yearRange: [1970, currentYear], // [min, max]
    minVote: 0
  };

  const [filters, setFilters] = useState(initialState);

  const resetFilters = () => {
    setFilters(initialState);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleGenre = (genreId) => {
    setFilters(prev => {
      const isSelected = prev.genres.includes(genreId);
      return {
        ...prev,
        genres: isSelected 
          ? prev.genres.filter(id => id !== genreId)
          : [...prev.genres, genreId]
      };
    });
  };

  return (
    <FiltersContext.Provider value={{
      filters,
      updateFilter,
      toggleGenre,
      resetFilters
    }}>
      {children}
    </FiltersContext.Provider>
  );
};

FiltersProvider.propTypes = {
  children: PropTypes.node.isRequired
};
