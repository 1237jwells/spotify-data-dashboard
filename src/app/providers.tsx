'use client';

import { ReactNode } from 'react';
import { SpotifyAuthProvider, useSpotifyAuth } from './context/SpotifyAuthContext';
import { SpotifyPlayerProvider } from './context/SpotifyPlayerContext';
import SpotifyPlayer from './components/SpotifyPlayer';

function AuthenticatedProviders({ children }: { children: ReactNode }) {
  const { isAuthenticated, accessToken } = useSpotifyAuth();

  // Wrap children with SpotifyPlayerProvider if authenticated.
  if (isAuthenticated && accessToken) {
    return (
      <SpotifyPlayerProvider accessToken={accessToken}>
        {children}
      </SpotifyPlayerProvider>
    );
  }

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SpotifyAuthProvider>
      <AuthenticatedProviders>
        {children}
      </AuthenticatedProviders>
      <SpotifyPlayer />
    </SpotifyAuthProvider>
  );
}