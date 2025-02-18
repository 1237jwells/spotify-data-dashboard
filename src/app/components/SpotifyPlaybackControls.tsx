"use client";

import { useSpotifyPlayer } from "@/app/context/SpotifyPlayerContext";
import Image from "next/image";

export default function SpotifyPlaybackControls() {
  const { isReady, togglePlay, currentTrack, isPaused } = useSpotifyPlayer();

  if (!isReady) {
    return (
      <div className="flex items-center justify-center py-4 text-white/60">
        <p>Connecting to Spotify...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-white">
      <div className="flex items-center space-x-4">
        {currentTrack?.album?.images?.[0]?.url && (
          <div className="relative w-16 h-16">
            <Image
              src={currentTrack.album.images[0].url}
              alt={currentTrack.album.name}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        <div>
          <h3 className="font-medium">
            {currentTrack ? currentTrack.name : "Nothing playing"}
          </h3>
          {currentTrack && (
            <p className="text-sm text-white/60">
              {currentTrack.artists.map(artist => artist.name).join(", ")}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => togglePlay()}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isPaused ? (
            <PlayIcon className="w-6 h-6" />
          ) : (
            <PauseIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}