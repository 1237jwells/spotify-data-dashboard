import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getAccessToken();
    const { id } = await Promise.resolve(params);
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${id}/tracks?market=US&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch album tracks');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching album tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch album tracks' },
      { status: 500 }
    );
  }
} 