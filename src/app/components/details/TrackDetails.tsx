"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Track } from '@/types/spotify';
import { useSpotifyAuth } from '@/app/context/SpotifyAuthContext';
import { useSpotifyPlayer } from '@/app/context/SpotifyPlayerContext';
import SpotifyLoginButton from '@/app/components/SpotifyLoginButton';

type TrackDetailsProps = {
  track: Track;
};

// Extract a child component that calls the hook
function SpotifyPlayerControls() {
  // Now this hook is always called when this component is rendered.
  // It assumes that its parent (or a higher-level component)
  // has wrapped the tree in SpotifyPlayerProvider.
  const spotifyPlayer = useSpotifyPlayer();
  const { playTrack, currentTrack, isPaused, isReady, error } = spotifyPlayer;

  return (
    <div>
      {isReady ? (
        <button onClick={() => playTrack(`spotify:track:${currentTrack?.id || ''}`)}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      ) : (
        <p>Player not ready</p>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

// This version is for logged-in users that have playback enabled.
function TrackDetailsWithPlayback({ track }: TrackDetailsProps) {
  const spotifyPlayer = useSpotifyPlayer();
  const { playTrack, currentTrack, isPaused, isReady } = spotifyPlayer;
  const [isThisTrackPlaying, setIsThisTrackPlaying] = useState(false);

  useEffect(() => {
    if (currentTrack?.id === track.id) {
      setIsThisTrackPlaying(true);
    } else {
      setIsThisTrackPlaying(false);
    }
  }, [currentTrack, track.id]);

  const handlePlayClick = async () => {
    if (!isReady) {
      alert('Spotify player is not ready. Make sure you are logged in with a Premium account.');
      return;
    }
    if (playTrack) {
      await playTrack(`spotify:track:${track.id}`);
    }
  };

  return (
    <div className="space-y-4">
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
            <button
              onClick={handlePlayClick}
              disabled={!isReady}
              className={`px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors ${
                !isReady ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isThisTrackPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
            </button>
            {/* Render the Spotify controls which call the hook */}
            <SpotifyPlayerControls />
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

// This version is rendered for users that are not logged in.
function ReadOnlyTrackDetails({ track }: TrackDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white/5 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <p className="text-yellow-400">
            👋 You&apos;re viewing in read-only mode. Connect with Spotify to enable full playback.
          </p>
          <SpotifyLoginButton />
        </div>
      </div>
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

export default function TrackDetails({ track }: TrackDetailsProps) {
  const { isAuthenticated } = useSpotifyAuth();
  return isAuthenticated ? (
    <TrackDetailsWithPlayback track={track} />
  ) : (
    <ReadOnlyTrackDetails track={track} />
  );
} 