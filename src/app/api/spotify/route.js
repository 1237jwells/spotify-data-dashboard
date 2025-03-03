import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  return data.access_token;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'track';

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter.' }, { status: 400 });
    }

    const token = await getAccessToken();
    if (!token) {
      throw new Error('Access token could not be retrieved.');
    }

    const spotifyResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!spotifyResponse.ok) {
      const errorData = await spotifyResponse.json();
      throw new Error(errorData.error?.message || spotifyResponse.statusText);
    }

    const data = await spotifyResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 