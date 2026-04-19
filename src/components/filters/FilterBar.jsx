import { useContext, useEffect, useState } from 'react';
import { FiltersContext } from '../../context/FiltersContext';
import { fetchGenres } from '../../api/requests';
import styles from './FilterBar.module.css';

const FilterBar = () => {
  const { filters, updateFilter, toggleGenre, resetFilters } = useContext(FiltersContext);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        console.error("Erreur filtres genre", error);
      }
    };
    loadGenres();
  }, []);

  return (
    <div className={styles.filterBar}>
      <div className={styles.section}>
        <h4 className={styles.title}>Trier par</h4>
        <select 
          value={filters.sortBy} 
          onChange={(e) => updateFilter('sortBy', e.target.value)}
        >
          <option value="popularity.desc">Popularité (Décroissant)</option>
          <option value="popularity.asc">Popularité (Croissant)</option>
          <option value="vote_average.desc">Notes (Décroissant)</option>
          <option value="primary_release_date.desc">Date (Récent d'abord)</option>
        </select>
      </div>

      <div className={styles.section}>
        <h4 className={styles.title}>Note minimum : ⭐ {filters.minVote}+</h4>
        <input 
          type="range" 
          min="0" 
          max="10" 
          step="1"
          value={filters.minVote}
          onChange={(e) => updateFilter('minVote', parseInt(e.target.value))}
        />
      </div>

      <div className={styles.section}>
        <h4 className={styles.title}>Genres</h4>
        <div className={styles.chips}>
          {genres.map(genre => (
            <button
              key={genre.id}
              className={`${styles.chip} ${filters.genres.includes(genre.id) ? styles.active : ''}`}
              onClick={() => toggleGenre(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.resetBtn} onClick={resetFilters}>
        Réinitialiser les filtres
      </button>
    </div>
  );
};

export default FilterBar;
