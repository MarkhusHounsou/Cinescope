import { useContext, useState } from 'react';
import HeroSection from '../components/hero/HeroSection';
import FilterBar from '../components/filters/FilterBar';
import MovieGrid from '../components/movies/MovieGrid';
import MovieModal from '../components/movies/MovieModal';
import { FiltersContext } from '../context/FiltersContext';
import { useMovies } from '../hooks/useMovies';

const Home = () => {
  const { filters } = useContext(FiltersContext);
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Construction des paramètres d'API basés sur le contexte
  const apiParams = {
    page,
    sort_by: filters.sortBy,
    'vote_average.gte': filters.minVote,
    'primary_release_date.gte': `${filters.yearRange[0]}-01-01`,
    'primary_release_date.lte': `${filters.yearRange[1]}-12-31`,
    ...(filters.genres.length > 0 ? { with_genres: filters.genres.join(',') } : {})
  };

  // On utilise discover au lieu de popular si on a des filtres actifs
  const hasActiveFilters = filters.genres.length > 0 || filters.minVote > 0 || filters.sortBy !== 'popularity.desc' || filters.yearRange[0] !== 1970;
  
  const endpoint = hasActiveFilters ? '/discover/movie' : '/movie/popular';

  const { movies, loading, totalPages } = useMovies(endpoint, apiParams);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  // Reset page quand les filtres changent
  if (page > 1 && JSON.stringify(apiParams) !== sessionStorage.getItem('lastParams')) {
    setPage(1);
  }
  sessionStorage.setItem('lastParams', JSON.stringify(apiParams));

  return (
    <>
      <HeroSection onMovieSelect={(id) => setSelectedMovie(id)} />
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--space-xl) var(--space-lg)', minHeight: '50vh' }} className="pageMain">
        <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-lg)', color: 'var(--color-text)' }}>
          Films Populaires
        </h2>
        
        <FilterBar />
        
        <MovieGrid 
          movies={movies} 
          loading={loading} 
          hasMore={page < totalPages && page < 500} // L'API TMDB limite à 500 pages max
          loadMore={loadMore} 
          onMovieSelect={(id) => setSelectedMovie(id)} 
        />
      </main>

      {selectedMovie && (
        <MovieModal 
          movieId={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </>
  );
};

export default Home;
