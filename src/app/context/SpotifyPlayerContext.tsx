"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

// Type definitions for Spotify Web Playback SDK
interface WebPlaybackTrack {
  uri: string;
  id: string;
  type: string;
  media_type: string;
  name: string;
  is_playable: boolean;
  album: {
    uri: string;
    name: string;
    images: { url: string }[];
  };
  artists: { uri: string; name: string }[];
}

interface WebPlaybackState {
  context: {
    uri: string;
    metadata: any;
  };
  disallows: {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: WebPlaybackTrack;
    previous_tracks: WebPlaybackTrack[];
    next_tracks: WebPlaybackTrack[];
  };
}

interface WebPlaybackPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (eventName: string, callback: (state: any) => void) => void;
  removeListener: (eventName: string, callback: (state: any) => void) => void;
  togglePlay: () => Promise<void>;
  getCurrentState: () => Promise<WebPlaybackState | null>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

interface SpotifyPlayerContextType {
  player: WebPlaybackPlayer | null;
  deviceId: string | null;
  isActive: boolean;
  currentTrack: WebPlaybackTrack | null;
  isPaused: boolean;
  playTrack: (trackUri: string) => Promise<void>;
  togglePlay: () => Promise<void>;
  isReady: boolean;
  error: string | null;
}

interface SpotifyPlayerProviderProps {
  children: ReactNode;
  accessToken: string;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextType | undefined>(undefined);

export function SpotifyPlayerProvider({ children, accessToken }: SpotifyPlayerProviderProps) {
  const [player, setPlayer] = useState<WebPlaybackPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<WebPlaybackTrack | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const player = new (window as any).Spotify.Player({
        name: 'Spotify Data Dashboard',
        getOAuthToken: (cb: (token: string) => void) => { cb(accessToken); },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Spotify Player Ready:', {
          device_id,
          accessToken: accessToken ? 'Present' : 'Missing',
          player: player ? 'Initialized' : 'Not initialized'
        });
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
        setDeviceId(null);
        setIsReady(false);
      });

      player.addListener('player_state_changed', (state: WebPlaybackState) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setIsActive(true);
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const playTrack = useCallback(async (trackUri: string) => {
    if (!deviceId) {
      setError('No device ID available');
      return;
    }
    
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to play track: ${errorData.error?.message || response.statusText}`);
        console.error('Playback error:', errorData);
      }
    } catch (error) {
      console.error('Error playing track:', error);
      setError('Failed to play track. Make sure you have Spotify Premium and the track is available in your region.');
    }
  }, [deviceId, accessToken]);

  const togglePlay = useCallback(async () => {
    if (!player) return;
    await player.togglePlay();
  }, [player]);

  return (
    <SpotifyPlayerContext.Provider value={{
      player,
      deviceId,
      isActive,
      currentTrack,
      isPaused,
      playTrack,
      togglePlay,
      isReady,
      error
    }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
}

export function useSpotifyPlayer() {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error('useSpotifyPlayer must be used within SpotifyPlayerProvider');
  }
  return context;
} 