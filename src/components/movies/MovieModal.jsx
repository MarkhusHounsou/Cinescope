import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './MovieModal.module.css';
import { fetchMovieDetails } from '../../api/requests';
import { BACKDROP_URL, IMAGE_URL } from '../../api/tmdb';

const MovieModal = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchMovieDetails(movieId);
        setMovie(data);
      } catch (error) {
        console.error("Erreur de récupération des détails", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadDetails();
    }
  }, [movieId]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movieId) return null;

  const formatRuntime = (minutes) => {
    if (!minutes) return "Inconnu";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? m + 'min' : ''}`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Inconnu";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount).replace('$', '') + ' $';
  };

  const getRatingColor = (rating) => {
    if (rating >= 7) return '#4caf50';
    if (rating >= 5) return '#ff9800';
    return '#f44336';
  };

  return (
    <div 
      className={styles.backdrop} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`${styles.modal} animate-slide-up`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className={styles.closeBtn} 
          onClick={onClose}
          aria-label="Fermer la modale"
        >
          ✕
        </button>

        {loading ? (
          <div className={styles.loading}>Chargement des détails...</div>
        ) : movie ? (
          <>
            <div 
              className={styles.hero}
              style={{ 
                backgroundImage: `url(${BACKDROP_URL}${movie.backdrop_path})` 
              }}
            >
              <div className={styles.heroGradient}></div>
              {movie.poster_path && (
                <img 
                  src={`${IMAGE_URL}${movie.poster_path}`} 
                  alt={movie.title} 
                  className={styles.poster}
                />
              )}
            </div>

            <div className={styles.content}>
              <h2 id="modal-title" className={styles.title}>{movie.title}</h2>
              {movie.tagline && <p className={styles.tagline}>"{movie.tagline}"</p>}

              <div className={styles.metrics}>
                <div className={styles.ratingInfo}>
                  <div className={styles.ratingBarContainer}>
                    <div 
                      className={styles.ratingBar} 
                      style={{ 
                        width: `${movie.vote_average * 10}%`,
                        backgroundColor: getRatingColor(movie.vote_average)
                      }}
                    ></div>
                  </div>
                  <span>{movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)</span>
                </div>
                <div className={styles.runtime}>{formatRuntime(movie.runtime)}</div>
              </div>

              <div className={styles.tags}>
                {movie.genres?.map(g => (
                  <span key={g.id} className={styles.genre}>{g.name}</span>
                ))}
                <span className={styles.status}>{movie.status}</span>
              </div>

              <div className={styles.synopsis}>
                <h3>Synopsis</h3>
                <p>{movie.overview || "Aucun synopsis disponible."}</p>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <strong>Date de sortie</strong>
                  <span>{movie.release_date || "Inconnue"}</span>
                </div>
                <div className={styles.detailItem}>
                  <strong>Langue originale</strong>
                  <span className={styles.up}>{movie.original_language}</span>
                </div>
                <div className={styles.detailItem}>
                  <strong>Budget</strong>
                  <span>{formatCurrency(movie.budget)}</span>
                </div>
                <div className={styles.detailItem}>
                  <strong>Revenus</strong>
                  <span>{formatCurrency(movie.revenue)}</span>
                </div>
                <div className={styles.detailItem}>
                  <strong>Production</strong>
                  <span>{movie.production_countries?.map(c => c.name).join(', ') || "N/A"}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.error}>Erreur de chargement.</div>
        )}
      </div>
    </div>
  );
};

MovieModal.propTypes = {
  movieId: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

export default MovieModal;
