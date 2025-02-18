"use client";

import { useSpotifyAuth } from "@/app/context/SpotifyAuthContext";
import SpotifyConnectButton from "./SpotifyLoginButton";
import SpotifyPlaybackControls from "./SpotifyPlaybackControls";
import SpotifyPlayerWrapper from "./SpotifyPlayerWrapper";

export default function SpotifyPlayer() {
  const { isAuthenticated } = useSpotifyAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 p-4">
      <div className="max-w-7xl mx-auto">
        {!isAuthenticated ? (
          <div className="flex items-center justify-center py-2">
            <SpotifyConnectButton />
          </div>
        ) : (
          <SpotifyPlayerWrapper>
            <SpotifyPlaybackControls />
          </SpotifyPlayerWrapper>
        )}
      </div>
    </div>
  );
} 