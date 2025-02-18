'use client';

import { ReactNode } from 'react';
import { SpotifyAuthProvider } from './context/SpotifyAuthContext';
import SpotifyPlayerWrapper from './components/SpotifyPlayerWrapper';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SpotifyAuthProvider>
      <SpotifyPlayerWrapper>
        {children}
      </SpotifyPlayerWrapper>
    </SpotifyAuthProvider>
  );
}