import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './RandomForm.module.css';
import { fetchGenres } from '../../api/requests';

const RandomForm = ({ onSubmit }) => {
  const currentYear = new Date().getFullYear();
  const [genres, setGenres] = useState([]);
  
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minYear, setMinYear] = useState(1990);
  const [minVote, setMinVote] = useState(6);
  const [maxRuntime, setMaxRuntime] = useState('');

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        console.error("Erreur de récupération des genres:", error);
      }
    };
    loadGenres();
  }, []);

  const toggleGenre = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      with_genres: selectedGenres.join(','),
      'primary_release_date.gte': `${minYear}-01-01`,
      'vote_average.gte': minVote,
      ...(maxRuntime ? { 'with_runtime.lte': maxRuntime } : {}) // Seulement si rempli
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>🎲 Quelle est votre envie du moment ?</h2>
      
      <div className={styles.group}>
        <label>Genres (Optionnel)</label>
        <div className={styles.chips}>
          {genres.map(g => (
            <button
              type="button"
              key={g.id}
              className={`${styles.chip} ${selectedGenres.includes(g.id) ? styles.active : ''}`}
              onClick={() => toggleGenre(g.id)}
            >
               {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label>Sorti après l'année : {minYear}</label>
        <input 
          type="range" 
          min="1950" 
          max={currentYear} 
          step="1"
          value={minYear}
          onChange={(e) => setMinYear(e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <label>Note minimale : ⭐ {minVote}+</label>
        <input 
          type="range" 
          min="0" 
          max="10" 
          step="1"
          value={minVote}
          onChange={(e) => setMinVote(e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <label>Durée maximale (en minutes, optionnel)</label>
        <input 
          type="number" 
          min="60" 
          max="300" 
          placeholder="Ex: 120"
          value={maxRuntime}
          onChange={(e) => setMaxRuntime(e.target.value)}
          className={styles.inputNumber}
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Trouver mon film
      </button>
    </form>
  );
};

RandomForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default RandomForm;
