import PropTypes from 'prop-types';
import styles from './MovieCard.module.css';

const MovieCard = ({ movie, onSelect }) => {
  const isNew = () => {
    if (!movie.release_date) return false;
    const releaseDate = new Date(movie.release_date);
    const today = new Date();
    const diffTime = Math.abs(today - releaseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 30;
  };

  const isTopRated = movie.vote_average >= 8;

  return (
    <div className={styles.card} onClick={() => onSelect(movie.id)}>
      <div className={styles.posterContainer}>
        {movie.poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            className={styles.poster}
            loading="lazy"
          />
        ) : (
          <div className={styles.noPoster}>
            <span>🎬</span>
            <p>Image indisponible</p>
          </div>
        )}
        
        <div className={styles.badges}>
          {isNew() && <span className={styles.badgeNew}>NOUVEAU</span>}
          {isTopRated && <span className={styles.badgeTop}>TOP</span>}
        </div>

        <div className={styles.overlay}>
          <h3 className={styles.title}>{movie.title}</h3>
          
          <div className={styles.meta}>
            <span className={styles.year}>{movie.release_date?.substring(0, 4)}</span>
            <span className={styles.rating}>⭐ {(movie.vote_average / 2).toFixed(1)}/5</span>
          </div>
          
          <p className={styles.overview}>{movie.overview || 'Aucun synopsis disponible.'}</p>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
    overview: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired
};

export default MovieCard;
