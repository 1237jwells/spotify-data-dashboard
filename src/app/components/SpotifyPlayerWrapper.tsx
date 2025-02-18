"use client";
import { ReactNode } from "react";
import { useSpotifyAuth } from "@/app/context/SpotifyAuthContext";
import { SpotifyPlayerProvider } from "@/app/context/SpotifyPlayerContext";

type SpotifyPlayerWrapperProps = {
  children: ReactNode;
};

export default function SpotifyPlayerWrapper({ children }: SpotifyPlayerWrapperProps) {
  const { accessToken, isAuthenticated } = useSpotifyAuth();

  // If the user is not authenticated, just render children (or your login UI)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // If authenticated but the access token hasn't arrived yet, show a fallback
  if (!accessToken) {
    return <div>Loading Player...</div>;
  }

  return (
    <SpotifyPlayerProvider accessToken={accessToken}>
      {children}
    </SpotifyPlayerProvider>
  );
}