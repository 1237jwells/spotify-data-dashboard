"use client";
import { SidebarArtistCard, SidebarTrackCard } from "@/components/SidebarCards";
import { useTrendingData } from "@/app/hooks/useTrendingData";

export default function TrendingSidebar() {
  const { data, loading, error } = useTrendingData();

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white/5 p-4 rounded">
          <div className="h-4 bg-white/10 rounded w-24 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-white/10 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                  <div className="h-2 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>;
  }

  if (error && !data) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded p-4 text-red-200">
        <p>Failed to load trending data</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-sm underline mt-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <div className="bg-white/5 p-4 rounded">
        <h3 className="font-semibold mb-2">Top Artists</h3>
        <div className="space-y-1">
          {data.topArtists.map((artist) => (
            <SidebarArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
      
      <div className="bg-white/5 p-4 rounded">
        <h3 className="font-semibold mb-2">Global Top Tracks</h3>
        <div className="space-y-1">
          {data.topTracks.map((track) => (
            <SidebarTrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>
    </>
  );
} 