import { useState, useEffect } from 'react';

/**
 * Hook pour détecter la position du scroll vertical.
 * Utile pour l'effet glassmorphism de la navbar.
 */
export const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
};
