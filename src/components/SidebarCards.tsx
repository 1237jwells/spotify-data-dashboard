import Image from 'next/image';
import { Artist, Track } from '@/types/spotify';

export function SidebarArtistCard({ artist }: { artist: Artist }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-white/10 rounded transition-colors">
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src={artist.images[0]?.url || '/placeholder.png'}
          alt={artist.name}
          fill
          className="object-cover rounded-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium truncate">{artist.name}</h4>
        <p className="text-sm text-gray-400">
          {artist.followers.total.toLocaleString()} followers
        </p>
      </div>
    </div>
  );
}

export function SidebarTrackCard({ track }: { track: Track }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-white/10 rounded transition-colors">
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src={track.album.images[0]?.url || '/placeholder.png'}
          alt={track.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium truncate">{track.name}</h4>
        <p className="text-sm text-gray-400 truncate">
          {track.artists.map(a => a.name).join(', ')}
        </p>
      </div>
    </div>
  );
} 