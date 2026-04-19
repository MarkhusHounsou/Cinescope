import { useContext, useState } from 'react';
import FilterBar from '../components/filters/FilterBar';
import MovieGrid from '../components/movies/MovieGrid';
import MovieModal from '../components/movies/MovieModal';
import { FiltersContext } from '../context/FiltersContext';
import { useMovies } from '../hooks/useMovies';

const NowPlaying = () => {
  const { filters } = useContext(FiltersContext);
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const apiParams = {
    page,
    sort_by: filters.sortBy,
    'vote_average.gte': filters.minVote,
    'primary_release_date.gte': `${filters.yearRange[0]}-01-01`,
    'primary_release_date.lte': `${filters.yearRange[1]}-12-31`,
    ...(filters.genres.length > 0 ? { with_genres: filters.genres.join(',') } : {})
  };

  const hasActiveFilters = filters.genres.length > 0 || filters.minVote > 0 || filters.sortBy !== 'popularity.desc' || filters.yearRange[0] !== 1970;
  
  const endpoint = hasActiveFilters ? '/discover/movie' : '/movie/now_playing';

  const { movies, loading, totalPages } = useMovies(endpoint, apiParams);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  if (page > 1 && JSON.stringify(apiParams) !== sessionStorage.getItem('lastParamsNowP')) {
    setPage(1);
  }
  sessionStorage.setItem('lastParamsNowP', JSON.stringify(apiParams));

  return (
    <main style={{ maxWidth: '1400px', margin: '0 auto', padding: 'calc(80px + var(--space-xl)) var(--space-lg) var(--space-xl)', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-lg)', color: 'var(--color-text)' }}>
        Films Actuellement En Salle
      </h2>
      
      <FilterBar />
      
      <MovieGrid 
        movies={movies} 
        loading={loading} 
        hasMore={page < totalPages && page < 500} 
        loadMore={loadMore} 
        onMovieSelect={(id) => setSelectedMovie(id)} 
      />

      {selectedMovie && (
        <MovieModal 
          movieId={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </main>
  );
};

export default NowPlaying;
