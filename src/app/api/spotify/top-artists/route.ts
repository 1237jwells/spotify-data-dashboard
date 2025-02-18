import { NextResponse } from 'next/server';
import { getAccessToken, getTop10ArtistsByFollowers } from '@/lib/spotify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter.' }, { status: 400 });
  }

  try {
    const accessToken = await getAccessToken();
    const artists = await getTop10ArtistsByFollowers(query, accessToken);
    return NextResponse.json({ artists });
  } catch (error: any) {
    console.error('Error fetching top artists:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 