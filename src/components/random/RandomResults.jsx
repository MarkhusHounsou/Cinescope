import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './RandomResults.module.css';
import MovieCard from '../movies/MovieCard';
import { fetchMovies } from '../../api/requests';

const RandomResults = ({ params, onReset, onMovieSelect }) => {
  const [pool, setPool] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPool = async () => {
    try {
      setLoading(true);
      // On fetch les 3 premières pages pour avoir un grand pool de films (60 max)
      const data1 = await fetchMovies('/discover/movie', { ...params, page: 1 });
      let allResults = [...data1.results];
      
      if (data1.total_pages > 1) {
        const data2 = await fetchMovies('/discover/movie', { ...params, page: 2 });
        allResults = [...allResults, ...data2.results];
      }
      if (data1.total_pages > 2) {
        const data3 = await fetchMovies('/discover/movie', { ...params, page: 3 });
        allResults = [...allResults, ...data3.results];
      }
      
      setPool(allResults);
      pickRandom(allResults);
    } catch (error) {
      console.error("Erreur discover random", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const pickRandom = (moviesPool = pool) => {
    if (moviesPool.length === 0) return;
    
    // Si moins de 6 films dispo, on les affiche tous, sinon on pioche 6 aléatoirement
    if (moviesPool.length <= 6) {
      setDisplayedMovies(moviesPool);
      return;
    }

    const shuffled = [...moviesPool].sort(() => 0.5 - Math.random());
    setDisplayedMovies(shuffled.slice(0, 6));
  };

  if (loading) {
    return <div className={styles.loading}>Recherche des meilleures pépites... 🎬</div>;
  }

  if (pool.length === 0) {
    return (
      <div className={styles.empty}>
        <h3>Aucun film ne correspond à vos envies !</h3>
        <button className={styles.btnNav} onClick={onReset}>Nouvelle recherche</button>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      <h2 className={styles.title}>Voici notre sélection pour vous</h2>
      
      <div className={styles.actions}>
        <button className={styles.btnReshuffle} onClick={() => pickRandom()}>
          🔀 Relancer la roulette
        </button>
        <button className={styles.btnReset} onClick={onReset}>
          🔄 Changer mes critères
        </button>
      </div>

      <div className={styles.grid}>
        {displayedMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onSelect={onMovieSelect} />
        ))}
      </div>
    </div>
  );
};

RandomResults.propTypes = {
  params: PropTypes.object.isRequired,
  onReset: PropTypes.func.isRequired,
  onMovieSelect: PropTypes.func.isRequired
};

export default RandomResults;
