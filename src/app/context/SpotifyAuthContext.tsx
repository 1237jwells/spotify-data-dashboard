'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

interface SpotifyAuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  error: string | null;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextType | undefined>(undefined);

const REQUIRED_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative'
].join(' ');

export function SpotifyAuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're returning from Spotify auth
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        console.log('Got access token:', token);
        setAccessToken(token);
        // Store the token
        localStorage.setItem('spotify_access_token', token);
        // Clear the hash from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else {
      // Check if we have a stored token
      const storedToken = localStorage.getItem('spotify_access_token');
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }

    // Check for error
    const urlParams = new URLSearchParams(window.location.search);
    const errorMsg = urlParams.get('error');
    if (errorMsg) {
      setError(errorMsg);
      console.error('Authentication error:', errorMsg);
    }
  }, []);

  const login = () => {
    console.log('SPOTIFY_CLIENT_ID:', SPOTIFY_CLIENT_ID);
    console.log('REDIRECT_URI:', REDIRECT_URI);
    if (!SPOTIFY_CLIENT_ID) {
      setError('Spotify Client ID is not configured');
      console.error('Missing Spotify Client ID');
      return;
    }

    // Generate a random state value
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('spotify_auth_state', state);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      state: state,
      scope: REQUIRED_SCOPES,
      show_dialog: 'true'
    };
    console.log('Redirecting to Spotify auth with params:', params);
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    authUrl.search = queryParams.toString();
    window.location.href = authUrl.toString();
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_auth_state');
    window.location.reload(); // Reload to reset all states
  };

  const value = {
    accessToken,
    isAuthenticated: !!accessToken,
    login,
    logout,
    error
  };

  return (
    <SpotifyAuthContext.Provider value={value}>
      {children}
    </SpotifyAuthContext.Provider>
  );
}

export function useSpotifyAuth() {
  const context = useContext(SpotifyAuthContext);
  if (context === undefined) {
    throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
  }
  return context;
} 