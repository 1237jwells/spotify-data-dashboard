import Image from 'next/image';
import { Track, Artist, Album } from '@/types/spotify';

export function TrackCard({ track }: { track: Track }) {
  return (
    <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
      <div className="aspect-square relative mb-4">
        <Image
          src={track.album.images[0]?.url || '/placeholder.png'}
          alt={track.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <h3 className="font-bold truncate">{track.name}</h3>
      <p className="text-sm text-gray-400 truncate">
        {track.artists.map(a => a.name).join(', ')}
      </p>
      <p className="text-sm text-gray-500">{track.album.name}</p>
    </div>
  );
}

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
      <div className="aspect-square relative mb-4">
        <Image
          src={artist.images[0]?.url || '/placeholder.png'}
          alt={artist.name}
          fill
          className="object-cover rounded-full"
        />
      </div>
      <h3 className="font-bold truncate">{artist.name}</h3>
      <p className="text-sm text-gray-400">
        {artist.followers.total.toLocaleString()} followers
      </p>
      <p className="text-sm text-gray-500 truncate">
        {artist.genres.slice(0, 2).join(', ')}
      </p>
    </div>
  );
}

export function AlbumCard({ album }: { album: Album }) {
  return (
    <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
      <div className="aspect-square relative mb-4">
        <Image
          src={album.images[0]?.url || '/placeholder.png'}
          alt={album.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <h3 className="font-bold truncate">{album.name}</h3>
      <p className="text-sm text-gray-400 truncate">
        {album.artists.map(a => a.name).join(', ')}
      </p>
      <p className="text-sm text-gray-500">
        {new Date(album.release_date).getFullYear()} • {album.total_tracks} tracks
      </p>
    </div>
  );
} 