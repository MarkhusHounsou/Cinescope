import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <h2>🎬 CinéScope</h2>
            <p>L'expérience cinéma premium, propulsée par React et TMDB.</p>
          </div>
          <div className={styles.links}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Portfolio</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.tmdb}>
            <img 
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
              alt="TMDB Logo" 
              className={styles.tmdbLogo}
            />
            <p>
              Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.
            </p>
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} CinéScope. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
