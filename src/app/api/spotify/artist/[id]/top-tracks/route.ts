import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cacheKey = `artist-top-tracks-${params.id}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${params.id}/top-tracks?market=US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch artist top tracks');
    }

    const data = await response.json();
    
    // Cache the result
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist top tracks' },
      { status: 500 }
    );
  }
} 