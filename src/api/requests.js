import { getApiUrl } from './tmdb';

export const fetchMovies = async (endpoint, params = {}) => {
  try {
    const response = await fetch(getApiUrl(endpoint, params));
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur fetchMovies (${endpoint}):`, error);
    throw error;
  }
};

export const fetchGenres = async () => {
  const cachedGenres = sessionStorage.getItem('tmdb_genres');
  if (cachedGenres) {
    return JSON.parse(cachedGenres);
  }

  try {
    const data = await fetchMovies('/genre/movie/list');
    sessionStorage.setItem('tmdb_genres', JSON.stringify(data.genres));
    return data.genres;
  } catch (error) {
    console.error('Erreur fetchGenres:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId) => {
  return await fetchMovies(`/movie/${movieId}`);
};
