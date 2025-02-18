"use client";

import { useState, useEffect } from "react";
import { TrackCard, ArtistCard, AlbumCard } from "@/components/ResultCards";
import TrendingSidebar from "@/app/components/TrendingSidebar";
import TrackDetails from "@/app/components/details/TrackDetails";
import ArtistDetails from "@/app/components/details/ArtistDetails";
import AlbumDetails from "@/app/components/details/AlbumDetails";
import { Track, Artist, Album } from "@/types/spotify";
// import { SkeletonAlbumCard, SkeletonArtistCard, SkeletonTrackCard } from "./components/Skeletons/skeletonCards";
import SpotifyLoginButton from "./components/SpotifyLoginButton";
import { useSpotifyAuth } from "./context/SpotifyAuthContext";

type SearchType = "track" | "artist" | "album";
type DetailView = {
  type: "track" | "artist" | "album";
  data: Track | Artist | Album;
} | null;

const SkeletonTrackCard = () => {
  return (
    <div className="animate-pulse bg-white/5 p-4 rounded-lg">
      <div className="w-full h-40 bg-white/10 rounded-lg mb-4" />
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
    </div>
  );
};

const SkeletonArtistCard = () => {
  return (
    <div className="animate-pulse bg-white/5 p-4 rounded-lg">
      <div className="w-32 h-32 mx-auto bg-white/10 rounded-full mb-4" />
      <div className="h-4 bg-white/10 rounded w-2/3 mx-auto" />
    </div>
  );
};

const SkeletonAlbumCard = () => {
  return (
    <div className="animate-pulse bg-white/5 p-4 rounded-lg">
      <div className="w-full h-40 bg-white/10 rounded-lg mb-4" />
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
    </div>
  );
};

export default function Home() {
  const { isAuthenticated } = useSpotifyAuth();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("track");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [detailView, setDetailView] = useState<DetailView>(null);

  async function fetchResults() {
    if (!query) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/spotify?q=${encodeURIComponent(query)}&type=${searchType}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType]);

  function handleItemClick(type: SearchType, item: Track | Artist | Album) {
    setDetailView({ type, data: item });
  }

  function handleBack() {
    setDetailView(null);
  }

  function renderResults() {
    if (!results) return null;

    const items = {
      track: results.tracks?.items,
      artist: results.artists?.items,
      album: results.albums?.items,
    }[searchType];

    if (!items?.length) {
      return <p className="text-center text-gray-500">No results found</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item: Track | Artist | Album) => {
          const props = { onClick: () => handleItemClick(searchType, item) };
          switch (searchType) {
            case "track":
              return (
                <div key={item.id} {...props} className="cursor-pointer">
                  <TrackCard track={item as Track} />
                </div>
              );
            case "artist":
              return (
                <div key={item.id} {...props} className="cursor-pointer">
                  <ArtistCard artist={item as Artist} />
                </div>
              );
            case "album":
              return (
                <div key={item.id} {...props} className="cursor-pointer">
                  <AlbumCard album={item as Album} />
                </div>
              );
          }
        })}
      </div>
    );
  }

  function renderSkeleton() {
    const skeletons = [];
    for (let i = 0; i < 8; i++) {
      if (searchType === "track") {
        skeletons.push(<SkeletonTrackCard key={i} />);
      } else if (searchType === "artist") {
        skeletons.push(<SkeletonArtistCard key={i} />);
      } else if (searchType === "album") {
        skeletons.push(<SkeletonAlbumCard key={i} />);
      }
    }
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skeletons}
      </div>
    );
  }

  function renderDetailView() {
    if (!detailView) return null;

    switch (detailView.type) {
      case "track":
        return (
          <TrackDetails track={detailView.data as Track} />
        );
      case "artist":
        return (
          <ArtistDetails
            artist={detailView.data as Artist}
            onTrackClick={(track: Track) => setDetailView({ type: "track", data: track })}
            onAlbumClick={(album: Album) => setDetailView({ type: "album", data: album })}
          />
        );
      case "album":
        return (
          <AlbumDetails
            album={detailView.data as Album}
            onTrackClick={(track: Track) => setDetailView({ type: "track", data: track })}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <header className="pt-8 pb-6 text-center">
        <div className="flex justify-end px-6 mb-4">
          <SpotifyLoginButton />
        </div>
        <h1 className="text-4xl font-bold">Spotify Data Dashboard</h1>
        <p className="mt-2 text-lg max-w-2xl mx-auto">
          Discover and search through Spotify's rich data. Explore tracks, artists, and albums like never before.
          {!isAuthenticated && (
            <span className="block mt-2 text-sm text-gray-400">
              Connect with Spotify to enable full playback features
            </span>
          )}
        </p>
      </header>

      <main className="w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-6">
          {/* Left Column - Trending/Sidebar */}
          <aside className="space-y-4">
            <TrendingSidebar />
          </aside>

          {/* Center Column - Search & Results */}
          <section>
            <div className="bg-white/5 p-6 rounded-lg">
              <div className="flex gap-4 mb-4 items-center">
                {detailView && (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>
                )}
                {["track", "artist", "album"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSearchType(type as SearchType);
                      setDetailView(null);
                    }}
                    className={`px-4 py-2 rounded ${
                      searchType === type
                        ? "bg-green-500 text-white"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}s
                  </button>
                ))}
              </div>
              {!detailView && (
                <input
                  type="text"
                  placeholder={`Search for ${searchType}s...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-3 rounded border bg-background text-foreground border-gray-700 focus:outline-none focus:border-green-500"
                />
              )}
            </div>
            <div className="mt-4">
              {detailView ? (
                renderDetailView()
              ) : (
                loading ? renderSkeleton() : renderResults()
              )}
            </div>
          </section>

          {/* Right Column - Placeholder for future content */}
          <div className="hidden md:block">
            {/* Reserved for future content */}
          </div>
        </div>
      </main>

      <footer className="mt-10 text-center p-6">
        <p className="text-sm">Powered by Spotify API & Next.js</p>
      </footer>
    </div>
  );
}
