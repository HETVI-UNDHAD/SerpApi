import { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Module-level cache: query → imageUrl (persists across re-renders)
const imageCache = new Map();

/**
 * Fetches a real image from SerpApi Google Images via the backend proxy.
 * Falls back gracefully through: SerpApi result → provided fallback → placeholder gradient.
 *
 * Props:
 *   query       — search query string (e.g. "Baga Beach Goa")
 *   fallbackSrc — optional URL to use if SerpApi returns nothing
 *   alt         — img alt text
 *   className   — CSS classes for the <img> element
 *   skeletonClassName — CSS classes for the loading skeleton wrapper
 *   eager       — if true, skip IntersectionObserver and load immediately
 */
export default function PlaceImage({
  query,
  fallbackSrc = null,
  alt = '',
  className = 'w-full h-full object-cover',
  skeletonClassName = 'w-full h-full',
  eager = false
}) {
  const [src, setSrc] = useState(null);       // null = loading, '' = failed
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Curated destination thumbnails are already available and avoid an extra
    // image-search request for every discovery row.
    if (fallbackSrc) {
      if (query) imageCache.set(query, fallbackSrc);
      setSrc(fallbackSrc);
      return;
    }
    if (!query) {
      setSrc('');
      return;
    }

    // Already cached
    if (imageCache.has(query)) {
      setSrc(imageCache.get(query) || fallbackSrc || '');
      return;
    }

    if (eager) {
      fetchImage();
      return;
    }

    // Lazy: only fetch when element enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fetchedRef.current) {
          fetchedRef.current = true;
          fetchImage();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [query]);

  async function fetchImage() {
    try {
      const res = await fetch(
        `${API_BASE}/api/images/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      const url = data.imageUrl || fallbackSrc || '';
      imageCache.set(query, url);
      setSrc(url);
    } catch {
      const url = fallbackSrc || '';
      imageCache.set(query, url);
      setSrc(url);
    }
  }

  const isLoading = src === null;
  const hasSrc = src && src.length > 0;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${skeletonClassName}`}>
      {/* Skeleton shimmer while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/40 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Actual image */}
      {hasSrc && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setSrc('')}
          className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Placeholder when no image available */}
      {!isLoading && !hasSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
          <span className="text-3xl opacity-30">🗺️</span>
        </div>
      )}
    </div>
  );
}
