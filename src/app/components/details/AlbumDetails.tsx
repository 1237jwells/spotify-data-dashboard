import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Album, Track } from '@/types/spotify';

type AlbumDetailsProps = {
  album: Album;
  onTrackClick: (track: Track) => void;
};

export default function AlbumDetails({ album, onTrackClick }: AlbumDetailsProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbumTracks() {
      try {
        const res = await fetch(`/api/spotify/album/${album.id}/tracks`);
        const data = await res.json();
        setTracks(data.items || []);
      } catch (error) {
        console.error('Error fetching album tracks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumTracks();
  }, [album.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="relative w-48 h-48 flex-shrink-0">
          <Image
            src={album.images[0]?.url || '/placeholder.png'}
            alt={album.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold truncate">{album.name}</h3>
          <p className="text-lg text-gray-400">
            {album.artists.map(a => a.name).join(', ')}
          </p>
          <p className="text-gray-500">
            {new Date(album.release_date).getFullYear()} • {album.total_tracks} tracks
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-lg">Tracks</h4>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(album.total_tracks)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => onTrackClick(track)}
                className="flex items-center gap-4 p-2 hover:bg-white/5 rounded cursor-pointer group"
              >
                <span className="w-8 text-right text-gray-500 group-hover:text-white">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{track.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {track.artists.map(a => a.name).join(', ')}
                  </p>
                </div>
                {track.preview_url && (
                  <span className="text-green-500 opacity-0 group-hover:opacity-100">
                    Preview available
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 