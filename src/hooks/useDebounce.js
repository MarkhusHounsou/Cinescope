import { useState, useEffect } from 'react';

/**
 * Hook pour débouncer une valeur d'input (recherche)
 * @param {any} value - La valeur à débouncer
 * @param {number} delay - Le délai en ms (ex: 400)
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
