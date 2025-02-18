import { useState, useEffect } from 'react';
import { Artist, Track } from '@/types/spotify';



export type TrendingData = {
  topArtists: Artist[];
  topTracks: Track[];
};

const CACHE_KEY = 'trendingData';
const CACHE_TIMESTAMP_KEY = 'trendingTimestamp';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export function useTrendingData() {
  const [data, setData] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchTrendingData() {
      try {
        // Try to get data from cache first
        if (typeof window !== 'undefined') {
          const cachedData = localStorage.getItem(CACHE_KEY);
          const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

          if (cachedData && cachedTimestamp) {
            const timestamp = parseInt(cachedTimestamp, 10);
            if (Date.now() - timestamp < CACHE_DURATION) {
              const parsedData = JSON.parse(cachedData);
              if (mounted) {
                setData(parsedData);
                setLoading(false);
                return;
              }
            }
          }
        }

        const response = await fetch('/api/spotify/trending');
        if (!response.ok) {
          throw new Error('Failed to fetch trending data');
        }

        const newData = await response.json();
        
        if (!mounted) return;

        if (newData.error) {
          throw new Error(newData.error);
        }

        setData(newData);

        // Update cache
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
          } catch (e) {
            console.warn('Failed to cache trending data:', e);
          }
        }
      } catch (err) {
        if (!mounted) return;
        
        setError(err instanceof Error ? err.message : 'An error occurred');
        
        // Try to use cached data as fallback, even if expired
        if (typeof window !== 'undefined') {
          const cachedData = localStorage.getItem(CACHE_KEY);
          if (cachedData) {
            try {
              setData(JSON.parse(cachedData));
            } catch (e) {
              console.warn('Failed to parse cached data:', e);
            }
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchTrendingData();
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
} 