import { useState, useEffect } from 'react';
import { fetchMovies } from '../api/requests';

/**
 * Hook générique pour récupérer une liste de films.
 * Supporte la pagination si necessaire dans les params.
 */
export const useMovies = (endpoint, params = {}, dependencies = []) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  // Stringify params pour les inclure dans useEffect en toute sécurité
  const paramsString = JSON.stringify(params);

  useEffect(() => {
    let isMounted = true;
    
    const loadMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchMovies(endpoint, JSON.parse(paramsString));
        if (isMounted) {
          // Si page > 1, on ajoute aux films existants, sinon on remplace
          if (params.page && params.page > 1) {
            setMovies(prev => [...prev, ...data.results]);
          } else {
            setMovies(data.results);
          }
          setTotalPages(data.total_pages);
          setTotalResults(data.total_results);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Une erreur est survenue lors de la récupération des films.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (endpoint) {
      loadMovies();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, paramsString, ...dependencies]);

  return { movies, loading, error, totalPages, totalResults, setMovies };
};
