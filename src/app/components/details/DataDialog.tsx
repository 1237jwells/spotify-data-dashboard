"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Track, Artist, Album } from '@/types/spotify';
import { formatDuration, formatNumber, formatDate } from '@/lib/utils';

type DataDialogProps = {
  data: Track | Artist | Album;
  onClose: () => void;
};

export default function DataDialog({ data, onClose }: DataDialogProps) {
  const [showMore, setShowMore] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  useEffect(() => {
    setShowMore(false);
    setActiveTab('overview');
  }, [data]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const getMainContent = () => {
    switch (data.type) {
      case 'track':
        return (
          <div className="space-y-3">
            <h5 className="text-xl font-bold">{data.name}</h5>
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Artists:</span>
                <span>{data.artists.map(a => a.name).join(', ')}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Album:</span>
                <span>{data.album.name}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Duration:</span>
                <span>{formatDuration(data.duration_ms)}</span>
              </p>
              {data.preview_url && (
                <div className="mt-2">
                  <audio
                    controls
                    src={data.preview_url}
                    className="w-full h-8"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 'artist':
        return (
          <div className="space-y-3">
            <h5 className="text-xl font-bold">{data.name}</h5>
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Followers:</span>
                <span>{formatNumber(data.followers.total)}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Popularity:</span>
                <div className="flex-1">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${data.popularity}%` }}
                    />
                  </div>
                </div>
              </p>
              {data.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.genres.map(genre => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-gray-700 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'album':
        return (
          <div className="space-y-3">
            <h5 className="text-xl font-bold">{data.name}</h5>
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Artists:</span>
                <span>{data.artists.map(a => a.name).join(', ')}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Release Date:</span>
                <span>{formatDate(data.release_date, data.release_date_precision)}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Tracks:</span>
                <span>{data.total_tracks}</span>
              </p>
              {data.label && (
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">Label:</span>
                  <span>{data.label}</span>
                </p>
              )}
              {data.popularity !== undefined && (
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">Popularity:</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${data.popularity}%` }}
                      />
                    </div>
                  </div>
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className={`bg-gray-900 rounded-lg relative w-full max-w-2xl max-h-[90vh] flex flex-col transition-transform duration-200 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
      >
        <div className="p-6 flex-shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 relative w-48 h-48">
              <Image
                src={
                  data.type === 'track'
                    ? data.album.images[0]?.url || '/placeholder.png'
                    : data.images[0]?.url || '/placeholder.png'
                }
                alt={data.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 text-white min-w-0">
              {getMainContent()}
              {data.external_urls?.spotify && (
                <a
                  href={data.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Open in Spotify
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'details'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Technical Details
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-4">
              {data.type === 'track' && (
                <>
                  <h3 className="text-lg font-semibold">About the Track</h3>
                  <p className="text-gray-400">
                    This track is from the album "{data.album.name}" by {data.artists.map(a => a.name).join(', ')}.
                  </p>
                </>
              )}
              {data.type === 'artist' && (
                <>
                  <h3 className="text-lg font-semibold">About the Artist</h3>
                  <p className="text-gray-400">
                    {data.name} has {formatNumber(data.followers.total)} followers and is known for {data.genres.join(', ')}.
                  </p>
                </>
              )}
              {data.type === 'album' && (
                <>
                  <h3 className="text-lg font-semibold">About the Album</h3>
                  <p className="text-gray-400">
                    Released {formatDate(data.release_date, data.release_date_precision)} by {data.artists.map(a => a.name).join(', ')}.
                    Contains {data.total_tracks} tracks.
                  </p>
                  {data.label && (
                    <p className="text-gray-400">
                      Released under {data.label}.
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="py-2 px-4 font-medium text-gray-400">ID</td>
                      <td className="py-2 px-4">{data.id}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-medium text-gray-400">Type</td>
                      <td className="py-2 px-4">{data.type}</td>
                    </tr>
                    {data.type === 'album' && (
                      <>
                        <tr>
                          <td className="py-2 px-4 font-medium text-gray-400">Release Precision</td>
                          <td className="py-2 px-4">{data.release_date_precision}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-medium text-gray-400">Album Type</td>
                          <td className="py-2 px-4">{data.album_type}</td>
                        </tr>
                        {data.copyrights && (
                          <tr>
                            <td className="py-2 px-4 font-medium text-gray-400">Copyrights</td>
                            <td className="py-2 px-4">
                              {data.copyrights.map((c, idx) => (
                                <p key={idx} className="text-sm text-gray-400">{c.text}</p>
                              ))}
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                    <tr>
                      <td className="py-2 px-4 font-medium text-gray-400">URI</td>
                      <td className="py-2 px-4 font-mono text-sm">{data.uri || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Raw JSON Data</h4>
                <pre className="bg-gray-800/50 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 