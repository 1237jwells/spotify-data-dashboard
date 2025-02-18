"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Track } from '@/types/spotify';
import { useSpotifyPlayer } from '@/app/context/SpotifyPlayerContext';
import { useSpotifyAuth } from '@/app/context/SpotifyAuthContext';
import SpotifyLoginButton from '@/app/components/SpotifyLoginButton';

type TrackDetailsProps = {
  track: Track;
};

export default function TrackDetails({ track }: TrackDetailsProps) {
  const { isAuthenticated } = useSpotifyAuth();
  const spotifyPlayer = isAuthenticated ? useSpotifyPlayer() : null;
  const {
    playTrack,
    togglePlay,
    currentTrack,
    isPaused,
    isActive,
    isReady,
    error
  } = spotifyPlayer || {};

  const [isThisTrackPlaying, setIsThisTrackPlaying] = useState(false);

  useEffect(() => {
    if (currentTrack?.id === track.id) {
      setIsThisTrackPlaying(true);
    } else {
      setIsThisTrackPlaying(false);
    }
  }, [currentTrack, track.id]);

  const handlePlayClick = async () => {
    if (!isAuthenticated) {
      alert('Please log in to play tracks');
      return;
    }
  };
    if (!isReady) {
      alert('Spotify player is not ready. Make sure you are logged in with a Premium account.');
      return;
    }
        <div className="relative w-48 h-48 flex-shrink-0">
          {isThisTrackPlaying ? (
            <button onClick={togglePlay}>Pause</button>
          ) : (
            <button onClick={() => playTrack && playTrack(`spotify:track:${track.id}`)}>Play</button>
          )}
        </div>

  return (
    <div className="space-y-4">
      {!isAuthenticated && (
        <div className="bg-white/5 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <p className="text-yellow-400">
              👋 You're viewing in read-only mode. Connect with Spotify to enable full playback.
            </p>
            <SpotifyLoginButton />
          </div>
        </div>
      )}

      <div className="flex items-start gap-6">
        <div className="relative w-48 h-48 flex-shrink-0">
          <Image
            src={track.album.images[0]?.url || '/placeholder.png'}
            alt={track.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold truncate">{track.name}</h3>
          <p className="text-lg text-gray-400">
            {track.artists.map(a => a.name).join(', ')}
          </p>
          <p className="text-gray-500">{track.album.name}</p>
          
          <div className="mt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handlePlayClick}
                  disabled={!isReady}
                  className={`px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors ${
                    !isReady ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isThisTrackPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
                </button>
                {error && (
                  <p className="text-red-500 text-sm mt-2">
                    {error}
                  </p>
                )}
                {!isReady && (
                  <p className="text-yellow-500 text-sm mt-2">
                    Connecting to Spotify... Make sure you're logged in with a Premium account.
                  </p>
                )}
              </>
            ) : (
              <button
                onClick={handlePlayClick}
                className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
              >
                Login to Play
              </button>
            )}
          </div>
        </div>
      </div>

      {track.preview_url && (
        <div className="mt-4">
          <h4 className="text-lg font-medium mb-2">30-second Preview</h4>
          <audio
            controls
            src={track.preview_url}
            className="w-full h-8"
          />
        </div>
      )}
    </div>
  );
} 