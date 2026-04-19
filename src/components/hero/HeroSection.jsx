import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './HeroSection.module.css';
import { fetchMovies } from '../../api/requests';
import { BACKDROP_URL } from '../../api/tmdb';

const HeroSection = ({ onMovieSelect }) => {
  const [trending, setTrending] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchMovies('/trending/movie/week');
        setTrending(data.results.slice(0, 5));
      } catch (error) {
        console.error("Erreur HeroSection:", error);
      }
    };
    loadTrending();
  }, []);

  useEffect(() => {
    if (trending.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % trending.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [trending]);

  if (trending.length === 0) return <div className={styles.placeholder}></div>;

  const currentMovie = trending[currentIndex];

  return (
    <header className={styles.hero}>
      <div 
        className={styles.backdrop}
        style={{ backgroundImage: `url(${BACKDROP_URL}${currentMovie.backdrop_path})` }}
      >
        <div className={styles.gradient}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h1 className="animate-slide-up">{currentMovie.title}</h1>
          
          <div className={styles.meta}>
            <span className={styles.rating}>
              ⭐ {(currentMovie.vote_average).toFixed(1)}/10
            </span>
            <span className={styles.date}>
              {currentMovie.release_date?.substring(0, 4)}
            </span>
          </div>

          <p className={styles.overview}>{currentMovie.overview}</p>
          
          <button 
            className={styles.button}
            onClick={() => onMovieSelect && onMovieSelect(currentMovie.id)}
          >
            Voir les détails
          </button>
        </div>

        <div className={styles.indicators}>
          {trending.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Aller au film ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

HeroSection.propTypes = {
  onMovieSelect: PropTypes.func
};

export default HeroSection;
