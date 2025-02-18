import { NextResponse } from 'next/server';
import { Artist, Track } from '@/types/spotify';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!response.ok) {
      console.error('Access token response not OK:', response.status, await response.text());
      throw new Error('Failed to get access token');
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

// Helper function to optimize image arrays
function optimizeImages(images: Artist['images']) {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }
  // Return only the smallest image that's still good quality (around 160px)
  return images.find(img => img.width >= 160 && img.width <= 320) || images[images.length - 1];
}

// Helper to optimize artist data
function optimizeArtistData(artist: Partial<Artist>): Artist | undefined {
  if (!artist?.id || !artist?.name) return undefined;
  try {
    const optimizedImage = optimizeImages(artist.images || []);
    return {
      id: artist.id,
      name: artist.name,
      images: optimizedImage ? [optimizedImage] : [],
      genres: (artist.genres || []).slice(0, 2),
      followers: { total: artist.followers?.total || 0 },
      type: artist.type || 'artist',
      popularity: artist.popularity || 0,
      uri: artist.uri || ''
    };
  } catch (error) {
    console.error('Error optimizing artist data:', error);
    return undefined;
  }
}

// Helper to optimize track data
// function optimizeTrackData(track: Partial<Track>): Track | undefined {
//   if (!track?.id || !track?.name || !track?.album) return undefined;
//   try {
//     const optimizedImage = optimizeImages(track.album?.images || []);
//     return {
//       id: track.id,
//       name: track.name,
//       artists: (track.artists || []).map((a: Partial<Artist>) => ({ name: a.name || 'Unknown Artist' })),
//       album: {
//         name: track.album.name || 'Unknown Album',
//         images: optimizedImage ? [optimizedImage] : []
//       },
//       duration_ms: track.duration_ms || 0,
//       preview_url: track.preview_url || null,
//       type: track.type || 'track',
//       uri: track.uri || ''
//     };
//   } catch (error) {
//     console.error('Error optimizing track data:', error);
//     return undefined;
//   }
// }

export async function GET() {
  try {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error('Missing Spotify credentials');
    }

    const token = await getAccessToken();

    // First, get featured playlists (this is dynamic trending content)
    const featuredResponse = await fetch(
      'https://api.spotify.com/v1/browse/featured-playlists?country=US&limit=1',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!featuredResponse.ok) {
      throw new Error('Failed to fetch featured playlists');
    }
    const featuredData = await featuredResponse.json();
    const playlist = featuredData.playlists?.items[0];
    if (!playlist) {
      throw new Error('No featured playlists found');
    }

    // Then, fetch tracks from the selected playlist
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!tracksResponse.ok) {
      throw new Error('Failed to fetch tracks from the playlist');
    }
    const tracksData = await tracksResponse.json();
    console.log("Fetched tracksData:", tracksData);

    // Validate that tracksData.items exists
    if (!tracksData || !Array.isArray(tracksData.items)) {
      throw new Error("Invalid response from Spotify: Missing 'items' in tracks data");
    }

    // Process the track data (and extract artists from these tracks if needed)
    const tracks = tracksData.items.map((item: { track?: Track }) => item.track).filter((track: Track | undefined): track is Track => track !== undefined);

    // For artists, as an example, de-duplicate artists from the trending tracks
    const artistMap: Record<string, Artist> = {};
    tracksData.items.forEach((item: { track?: Track }) => {
      item.track?.artists.forEach((a: Partial<Artist>) => {
        const optimizedArtist = optimizeArtistData(a);
        if (optimizedArtist && !artistMap[optimizedArtist.id]) {
          artistMap[optimizedArtist.id] = optimizedArtist;
        }
      });
    });
    const artists = Object.values(artistMap);

    if (artists.length === 0 && tracks.length === 0) {
      throw new Error('No valid trending data received from Spotify');
    }

    // Cache the response for 15 minutes
    return NextResponse.json(
      { topArtists: artists, topTracks: tracks },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' } }
    );
  } catch (error) {
    console.error('Trending API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch trending data' },
      { status: 500 }
    );
  }
} 