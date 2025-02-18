type SpotifyImage = {
  url: string;
  height: number;
  width: number;
};

export type Track = {
  id: string;
  name: string;
  type: 'track';
  artists: { name: string; id?: string }[];
  album: {
    name: string;
    images: SpotifyImage[];
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls?: { spotify: string };
  uri: string;
};

export type Artist = {
  id: string;
  name: string;
  type: 'artist';
  images: SpotifyImage[];
  genres: string[];
  followers: { total: number };
  popularity: number;
  external_urls?: { spotify: string };
  uri: string;
};

export type Album = {
  id: string;
  name: string;
  type: 'album';
  album_type: 'album' | 'single' | 'compilation';
  images: SpotifyImage[];
  artists: { name: string; id?: string }[];
  release_date: string;
  total_tracks: number;
  external_urls: { spotify: string };
  uri: string;
  release_date_precision: string;
  available_markets: string[];
  href: string;
  label?: string;
  popularity?: number;
  genres?: string[];
  copyrights?: { text: string; type: string }[];
}; 