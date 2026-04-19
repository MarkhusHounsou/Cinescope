import { useState } from 'react';
import RandomForm from '../components/random/RandomForm';
import RandomResults from '../components/random/RandomResults';
import MovieModal from '../components/movies/MovieModal';

const Random = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams(null);
  };

  return (
    <main style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: 'calc(80px + var(--space-xl)) var(--space-lg) var(--space-xl)', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {!searchParams ? (
        <RandomForm onSubmit={handleSearch} />
      ) : (
        <RandomResults 
          params={searchParams} 
          onReset={handleReset} 
          onMovieSelect={(id) => setSelectedMovie(id)} 
        />
      )}

      {selectedMovie && (
        <MovieModal 
          movieId={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </main>
  );
};

export default Random;
