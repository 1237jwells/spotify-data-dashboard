"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Artist, Track, Album } from '@/types/spotify';
import AlbumDetails from '@/app/components/details/AlbumDetails';
import LongPressable from "@/app/components/LongPressable";
import DataDialog from "@/app/components/details/DataDialog";
import { formatNumber } from '@/lib/utils';
import { useSpotifyPlayer } from '@/app/context/SpotifyPlayerContext';
import { useSpotifyAuth } from "@/app/context/SpotifyAuthContext";
import SpotifyLoginButton from '@/app/components/SpotifyLoginButton';

type ArtistDetailsProps = {
    artist: Artist;
    onTrackClick: (track: Track) => void;
    onAlbumClick: (album: Album) => void;
};

export default function ArtistDetails({ artist, onTrackClick, onAlbumClick }: ArtistDetailsProps) {
    const { isAuthenticated } = useSpotifyAuth();
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loadingTracks, setLoadingTracks] = useState(true);
    const [loadingAlbums, setLoadingAlbums] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [albumDialog, setAlbumDialog] = useState<Album | null>(null);
    const [trackDialog, setTrackDialog] = useState<Track | null>(null);
    const [artistDialog, setArtistDialog] = useState<Artist | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

    // Only use SpotifyPlayer when authenticated
    const spotifyPlayer = isAuthenticated ? useSpotifyPlayer() : null;
    const { playTrack, togglePlay, currentTrack, isPaused, isReady } = spotifyPlayer || {};

    // Fetch artist top tracks
    useEffect(() => {
        async function fetchTopTracks() {
            try {
                const res = await fetch(
                    `/api/spotify/artist/${artist.id}/top-tracks?country=US`
                );
                const data = await res.json();
                setTopTracks(data.tracks || []);
            } catch (error) {
                console.error('Error fetching top tracks', error);
            } finally {
                setLoadingTracks(false);
            }
        }
        fetchTopTracks();
    }, [artist.id]);

    // Fetch artist albums
    useEffect(() => {
        async function fetchAlbums() {
            try {
                const res = await fetch(
                    `/api/spotify/artist/${artist.id}/albums?include_groups=album,single,compilation&market=US&limit=50`
                );
                const data = await res.json();
                setAlbums(data.items || []);
            } catch (error) {
                console.error('Error fetching albums', error);
            } finally {
                setLoadingAlbums(false);
            }
        }
        fetchAlbums();
    }, [artist.id]);

    const handleTrackClick = useCallback((track: Track) => {
        if (!isAuthenticated) {
            // Show login prompt if not authenticated
            alert('Please log in to play tracks');
            return;
        }
        
        if (currentTrack?.id === track.id) {
            togglePlay?.();
        } else {
            playTrack?.(`spotify:track:${track.id}`);
        }
    }, [currentTrack, playTrack, togglePlay, isAuthenticated]);

    // Sort and filter albums
    const sortedAlbums = [...albums].sort((a, b) => {
        const dateA = new Date(a.release_date);
        const dateB = new Date(b.release_date);
        return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    const fullAlbums = sortedAlbums.filter(a => a.album_type === 'album');
    const singlesAndEPs = sortedAlbums.filter(a => a.album_type === 'single' || a.album_type === 'compilation');

    const renderTrackList = (tracks: Track[]) => (
        <div className={viewType === 'grid' 
            ? "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4"
            : "space-y-2"
        }>
            {tracks.map(track => (
                <LongPressable
                    key={track.id}
                    onLongPress={() => setTrackDialog(track)}
                    onClick={() => handleTrackClick(track)}
                >
                    <div className={`cursor-pointer group ${
                        viewType === 'list' ? 'flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg' : ''
                    }`}>
                        <div className={viewType === 'grid' ? 'relative aspect-square mb-3' : 'relative w-12 h-12'}>
                            <Image
                                src={track.album.images[0]?.url || '/placeholder.png'}
                                alt={track.name}
                                fill
                                className="object-cover rounded"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                {isAuthenticated ? (
                                    currentTrack?.id === track.id ? (
                                        <button className="p-2 bg-green-500 rounded-full">
                                            {isPaused ? "▶️" : "⏸️"}
                                        </button>
                                    ) : (
                                        <button className="p-2 bg-green-500 rounded-full">▶️</button>
                                    )
                                ) : (
                                    <button className="p-2 bg-gray-500 rounded-full" title="Login to play">🔒</button>
                                )}
                            </div>
                        </div>
                        <div className={viewType === 'list' ? 'flex-1 min-w-0' : ''}>
                            <p className="font-medium truncate">{track.name}</p>
                            {viewType === 'list' && (
                                <p className="text-sm text-gray-400 truncate">
                                    {track.artists.map(a => a.name).join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                </LongPressable>
            ))}
        </div>
    );

    const renderAlbumSection = (title: string, albums: Album[]) => (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{title}</h3>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                        title="Toggle sort order"
                    >
                        {sortOrder === 'desc' ? '↓' : '↑'}
                    </button>
                    <button
                        onClick={() => setViewType(prev => prev === 'grid' ? 'list' : 'grid')}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                        title="Toggle view type"
                    >
                        {viewType === 'grid' ? '≣' : '⊞'}
                    </button>
                </div>
            </div>
            <div className={viewType === 'grid' 
                ? "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4"
                : "space-y-2"
            }>
                {albums.map(album => (
                    <LongPressable
                        key={album.id}
                        onLongPress={() => setAlbumDialog(album)}
                        onClick={() => setSelectedAlbum(album)}
                    >
                        <div className={`cursor-pointer group ${
                            viewType === 'list' ? 'flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg' : ''
                        }`}>
                            <div className={viewType === 'grid' ? 'relative aspect-square mb-3' : 'relative w-12 h-12'}>
                                <Image
                                    src={album.images[0]?.url || '/placeholder.png'}
                                    alt={album.name}
                                    fill
                                    className="object-cover rounded"
                                />
                            </div>
                            <div className={viewType === 'list' ? 'flex-1 min-w-0' : ''}>
                                <p className="font-medium truncate">{album.name}</p>
                                {viewType === 'list' && (
                                    <>
                                        <p className="text-sm text-gray-400 truncate">
                                            {album.artists.map(a => a.name).join(', ')}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(album.release_date).getFullYear()} • {album.total_tracks} tracks
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </LongPressable>
                ))}
            </div>
        </section>
    );

    return (
        <div className="space-y-8">
            {/* Login prompt for unauthenticated users */}
            {!isAuthenticated && (
                <div className="bg-white/5 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                        <p className="text-yellow-400">
                            👋 You're viewing in read-only mode. Connect with Spotify to enable full playback.
                        </p>
                        <SpotifyLoginButton />
                    </div>
                </div>
            )}

            {/* Dialogs */}
            {artistDialog && (
                <DataDialog
                    data={artistDialog}
                    onClose={() => setArtistDialog(null)}
                />
            )}
            {trackDialog && (
                <DataDialog
                    data={trackDialog}
                    onClose={() => setTrackDialog(null)}
                />
            )}
            {albumDialog && (
                <DataDialog
                    data={albumDialog}
                    onClose={() => setAlbumDialog(null)}
                />
            )}

            {/* Artist Header */}
            <LongPressable
                onLongPress={() => setArtistDialog(artist)}
                onClick={() => {/* Optional click handler */}}
            >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="relative w-48 h-48 flex-shrink-0">
                        <Image
                            src={artist.images[0]?.url || '/placeholder.png'}
                            alt={artist.name}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold">{artist.name}</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {artist.genres.map(genre => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4 space-y-2">
                            <p className="text-gray-400">
                                {formatNumber(artist.followers.total)} followers
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">Popularity</span>
                                <div className="flex-1 max-w-xs">
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${artist.popularity}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LongPressable>

            {/* Top Tracks */}
            <section>
                <h3 className="text-2xl font-semibold mb-4">Top Tracks</h3>
                {loadingTracks ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white/5 aspect-square rounded mb-2" />
                                <div className="bg-white/5 h-4 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : topTracks.length > 0 ? (
                    renderTrackList(topTracks)
                ) : (
                    <p>No top tracks found.</p>
                )}
            </section>

            {/* Albums */}
            {loadingAlbums ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-white/5 aspect-square rounded mb-2" />
                            <div className="bg-white/5 h-4 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {fullAlbums.length > 0 && renderAlbumSection('Albums', fullAlbums)}
                    {singlesAndEPs.length > 0 && renderAlbumSection('Singles & EPs', singlesAndEPs)}
                </>
            )}

            {/* Album Details View */}
            {selectedAlbum && (
                <div className="mt-8 border-t pt-4">
                    <AlbumDetails
                        album={selectedAlbum}
                        onTrackClick={handleTrackClick}
                    />
                    <button
                        onClick={() => setSelectedAlbum(null)}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                        Back to Albums
                    </button>
                </div>
            )}
        </div>
    );
}