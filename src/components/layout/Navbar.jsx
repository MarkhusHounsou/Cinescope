import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useScrollY } from '../../hooks/useScrollY';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchMovies } from '../../api/requests';

const Navbar = () => {
  const scrollY = useScrollY();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  useEffect(() => {
    const searchMovies = async () => {
      if (debouncedSearchTerm.trim()) {
        try {
          setIsSearching(true);
          const data = await fetchMovies('/search/movie', {
            query: debouncedSearchTerm,
            page: 1
          });
          setSearchResults(data.results.slice(0, 5));
        } catch (error) {
          console.error("Erreur de recherche", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    searchMovies();
  }, [debouncedSearchTerm]);

  // Fermer la recherche si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          🎬 CinéScope
        </NavLink>

        <div className={styles.links}>
          <NavLink to="/" className={({isActive}) => isActive ? styles.active : ''} end>Populaires</NavLink>
          <NavLink to="/now-playing" className={({isActive}) => isActive ? styles.active : ''}>En salle</NavLink>
          <NavLink to="/top-rated" className={({isActive}) => isActive ? styles.active : ''}>Top Rated</NavLink>
          <NavLink to="/upcoming" className={({isActive}) => isActive ? styles.active : ''}>À venir</NavLink>
          <NavLink to="/random" className={({isActive}) => isActive ? styles.active : ''}>Aléatoire</NavLink>
        </div>

        <div className={styles.searchContainer} ref={searchRef}>
          <input 
            type="text" 
            placeholder="Rechercher un film..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          
          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map(movie => (
                <div 
                  key={movie.id} 
                  className={styles.searchItem}
                  onClick={() => handleResultClick()}
                >
                  <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/45x68'} 
                    alt={movie.title}
                  />
                  <div className={styles.searchItemInfo}>
                    <h4>{movie.title}</h4>
                    <span>{movie.release_date?.substring(0,4)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
