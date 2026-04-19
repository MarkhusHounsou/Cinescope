import PropTypes from 'prop-types';
import styles from './MovieGrid.module.css';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const MovieGrid = ({ movies, loading, hasMore, loadMore, onMovieSelect }) => {
  const lastElementRef = useInfiniteScroll(loading, hasMore, loadMore);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {movies.map((movie, index) => {
          // Attache la ref d'intersection au dernier élément de la liste
          if (movies.length === index + 1) {
            return (
              <div ref={lastElementRef} key={movie.id + '-' + index}>
                <MovieCard movie={movie} onSelect={onMovieSelect} />
              </div>
            );
          }
          return <MovieCard key={movie.id + '-' + index} movie={movie} onSelect={onMovieSelect} />;
        })}
        
        {loading && (
          Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonCard key={`skeleton-${idx}`} />
          ))
        )}
      </div>

      {!hasMore && movies.length > 0 && (
        <div className={styles.endMessage}>
          Vous avez atteint la fin de la liste ! 🍿
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className={styles.emptyMessage}>
          Aucun film ne correspond à vos critères de recherche.
        </div>
      )}
    </div>
  );
};

MovieGrid.propTypes = {
  movies: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  onMovieSelect: PropTypes.func.isRequired
};

export default MovieGrid;
