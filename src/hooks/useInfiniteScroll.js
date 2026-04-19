import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook pour la pagination infinie via IntersectionObserver
 * @param {boolean} loading - Est-ce qu'on est en train de charger ?
 * @param {boolean} hasMore - Y a-t-il plus de pages ?
 * @param {Function} loadMore - Fonction à appeler pour charger plus
 */
export const useInfiniteScroll = (loading, hasMore, loadMore) => {
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, loadMore]);

  return lastElementRef;
};
