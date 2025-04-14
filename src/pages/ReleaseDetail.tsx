import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Howl } from 'howler';
import { apiService } from '../services/api';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export function ReleaseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);

  const { data: release, isLoading } = useQuery({
    queryKey: ['release', id],
    queryFn: () => apiService.getRelease(Number(id))
  });

  const playTrack = async (trackId: number, audioFileId: number) => {
    if (sound) {
      sound.unload();
    }

    try {
      const { streamingUrl } = await apiService.getStreamingUrl(audioFileId);
      const newSound = new Howl({
        src: [streamingUrl],
        html5: true,
        onend: () => {
          setIsPlaying(false);
          setCurrentTrack(null);
        }
      });

      setSound(newSound);
      setCurrentTrack(trackId);
      setIsPlaying(true);
      newSound.play();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const togglePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopPlayback = () => {
    if (sound) {
      sound.stop();
      sound.unload();
      setSound(null);
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/releases" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Back to Releases
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            {isLoading ? 'Loading...' : release?.title}
          </h1>
          {release && (
            <p className="mt-1 text-sm text-gray-500">
              Released on {format(new Date(release.releaseDate), 'MMMM d, yyyy')}
            </p>
          )}
        </div>
        {user?.userType === 'artist' && release?.artistId === user.userId && (
          <div className="flex space-x-3">
            <Link
              to={`/artist/releases/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit Release
            </Link>
            <Link
              to={`/artist/tracks/new?releaseId=${id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Track
            </Link>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">Loading...</div>
      ) : !release ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">Release not found</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {release.tracks?.map((track, index) => (
              <li key={track.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">
                      {currentTrack === track.id ? (
                        <button
                          onClick={togglePlayPause}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {isPlaying ? (
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => track.audioFile && playTrack(track.id, track.audioFile.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{track.title}</p>
                      <p className="text-sm text-gray-500">
                        {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                  {user?.userType === 'artist' && release.artistId === user.userId && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => track.audioFile && playTrack(track.id, track.audioFile.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement track deletion
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 