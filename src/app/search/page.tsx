"use client";

import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!query) return;
    
    setLoading(true);
    // Now fetch top artists sorted by followers
    const res = await fetch(`/api/spotify/top-artists?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="p-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search Spotify for top artists"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>

      {loading && <p className="mt-4">Loading...</p>}

      {results && results.artists && (
        <div className="mt-4">
          {/* Display the top 10 artists */}
          <ul>
            {results.artists.map((artist: any) => (
              <li key={artist.id}>
                <strong>{artist.name}</strong> — Followers: {artist.followers.total}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 