import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify';

const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function GET(request, context) {
  try {
    const { params } = context;
    const albumId = params.id;
    const cacheKey = `album-tracks-${albumId}`;
    const cachedItem = cache.get(cacheKey);

    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedItem.data);
    }

    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch album tracks: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // Cache the response data
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in album tracks route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch album tracks';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}