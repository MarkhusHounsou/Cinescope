import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useScrollY } from '../../hooks/useScrollY';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchMovies } from '../../api/requests';

const Navbar = () => {
  const scrollY = useScrollY();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  // Fermer le menu si on scrolle
  useEffect(() => {
    if (scrollY > 10) setMenuOpen(false);
  }, [scrollY]);

  useEffect(() => {
    const searchMovies = async () => {
      if (debouncedSearchTerm.trim().length >= 2) {
        try {
          setIsSearching(true);
          const data = await fetchMovies('/search/movie', {
            query: debouncedSearchTerm,
            page: 1
          });
          setSearchResults(data.results.slice(0, 6));
        } catch (error) {
          console.error("Erreur de recherche", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
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

  // Bloquer le scroll du body quand menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleResultClick = (movieId) => {
    setSearchTerm('');
    setSearchResults([]);
    setMenuOpen(false);
    navigate(`/?movie=${movieId}`);
  };

  const navLinks = [
    { to: '/', label: 'Populaires', end: true },
    { to: '/now-playing', label: 'En salle' },
    { to: '/top-rated', label: 'Top Rated' },
    { to: '/upcoming', label: 'À venir' },
    { to: '/random', label: 'Aléatoire' },
  ];

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuActive : ''}`}>
        <div className={styles.container}>
          <NavLink to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            🎬 CinéScope
          </NavLink>

          {/* Desktop links */}
          <div className={styles.links}>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => isActive ? styles.active : ''}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop search */}
          <div className={styles.searchContainer} ref={searchRef}>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Rechercher un film..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                aria-label="Rechercher un film"
              />
              {isSearching && <span className={styles.spinner}></span>}
              {searchTerm && (
                <button
                  className={styles.clearBtn}
                  onClick={() => { setSearchTerm(''); setSearchResults([]); }}
                  aria-label="Effacer la recherche"
                >
                  ✕
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className={styles.searchResults} role="listbox">
                {searchResults.map(movie => (
                  <div
                    key={movie.id}
                    className={styles.searchItem}
                    onClick={() => handleResultClick(movie.id)}
                    role="option"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleResultClick(movie.id)}
                  >
                    <img
                      src={movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : `https://placehold.co/45x68/150C0E/F5E6E8?text=N/A`}
                      alt={movie.title}
                    />
                    <div className={styles.searchItemInfo}>
                      <h4>{movie.title}</h4>
                      <span>
                        {movie.release_date?.substring(0, 4)}
                        {movie.vote_average > 0 && ` · ⭐ ${movie.vote_average.toFixed(1)}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {debouncedSearchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
              <div className={styles.searchResults}>
                <div className={styles.noResult}>Aucun résultat pour « {debouncedSearchTerm} »</div>
              </div>
            )}
          </div>

          {/* Burger button */}
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileSearch} ref={menuOpen ? searchRef : null}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              aria-label="Rechercher un film"
            />
            {isSearching && <span className={styles.spinner}></span>}
            {searchTerm && (
              <button
                className={styles.clearBtn}
                onClick={() => { setSearchTerm(''); setSearchResults([]); }}
              >✕</button>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map(movie => (
                <div
                  key={movie.id}
                  className={styles.searchItem}
                  onClick={() => handleResultClick(movie.id)}
                >
                  <img
                    src={movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : `https://placehold.co/45x68/150C0E/F5E6E8?text=N/A`}
                    alt={movie.title}
                  />
                  <div className={styles.searchItemInfo}>
                    <h4>{movie.title}</h4>
                    <span>{movie.release_date?.substring(0, 4)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className={styles.mobileLinks}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Backdrop mobile */}
      {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;
