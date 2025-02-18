"use client";

import { useSpotifyAuth } from "@/app/context/SpotifyAuthContext";

export default function SpotifyConnectButton() {
  const { login, logout, isAuthenticated } = useSpotifyAuth();

  return (
    <div>
      {isAuthenticated ? (
        <button
          onClick={logout}
          className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Disconnect from Spotify
        </button>
      ) : (
        <button
          onClick={login}
          className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Connect with Spotify
        </button>
      )}
    </div>
  );
}