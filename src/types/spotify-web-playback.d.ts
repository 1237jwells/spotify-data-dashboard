export interface SpotifyPlayerConstructorOptions {
  name: string;
  getOAuthToken: (callback: (token: string) => void) => void;
  volume: number;
}

export interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: string, callback: (state: WebPlaybackState) => void): void;
  removeListener(event: string, callback: (state: WebPlaybackState) => void): void;
  togglePlay(): Promise<void>;
  getCurrentState(): Promise<WebPlaybackState | null>;
  setVolume(volume: number): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  previousTrack(): Promise<void>;
  nextTrack(): Promise<void>;
}

export interface SpotifyWebPlaybackSDK {
  Player: new (options: SpotifyPlayerConstructorOptions) => SpotifyPlayer;
}

// Define this interface so you can safely cast window
export interface WindowWithSpotify extends Window {
  Spotify: SpotifyWebPlaybackSDK;
} 