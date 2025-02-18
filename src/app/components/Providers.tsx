'use client';

import { SpotifyAuthProvider } from '../context/SpotifyAuthContext';
import SpotifyPlayer from './SpotifyPlayer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SpotifyAuthProvider>
      {children}
      <SpotifyPlayer />
    </SpotifyAuthProvider>
  );
} 