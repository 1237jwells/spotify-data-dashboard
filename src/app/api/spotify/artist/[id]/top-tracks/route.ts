import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist top tracks' },
      { status: 500 }
    );
  }
} 