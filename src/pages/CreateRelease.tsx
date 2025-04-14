import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Track {
  title: string;
  audioFile?: File;
}

export function CreateRelease() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [tracks, setTracks] = useState<Track[]>([{ title: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTrack = () => {
    setTracks([...tracks, { title: '' }]);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const updateTrack = (index: number, field: keyof Track, value: string | File) => {
    const updatedTracks = [...tracks];
    updatedTracks[index] = { ...updatedTracks[index], [field]: value };
    setTracks(updatedTracks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Create the release first
      const release = await apiService.createRelease({
        title,
        releaseDate: releaseDate ? new Date(releaseDate).toISOString() : new Date().toISOString(),
        artistId: user.userId
      });

      // Upload each track's audio file and create track records
      for (const track of tracks) {
        if (track.audioFile) {
          try {
            const audioFile = track.audioFile; // Store in a variable to satisfy TypeScript
            // Get upload URL for the audio file
            const { uploadUrl, fileKey } = await apiService.getUploadUrl(
              audioFile.name,
              audioFile.type
            );

            // Upload the file to Backblaze using XMLHttpRequest
            await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('PUT', uploadUrl, true);
              xhr.setRequestHeader('Content-Type', audioFile.type);

              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(xhr.response);
                } else {
                  reject(new Error(`Upload failed with status ${xhr.status}`));
                }
              };

              xhr.onerror = () => {
                reject(new Error('Upload failed'));
              };

              xhr.send(audioFile);
            });

            // Register the audio file
            const registeredAudioFile = await apiService.registerAudioFile({
              fileKey,
              fileSize: audioFile.size,
              checksum: '' // TODO: Implement checksum calculation
            });

            // Create the track with the audio file
            await apiService.createTrack({
              title: track.title,
              releaseId: release.id
            }, release.id, registeredAudioFile.id);
          } catch (uploadError) {
            console.error('Error uploading track:', uploadError);
            setError(`Failed to upload track "${track.title}": ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
            throw uploadError;
          }
        } else {
          // Create track without audio file
          await apiService.createTrack({
            title: track.title,
            releaseId: release.id
          }, release.id);
        }
      }

      navigate(`/releases/${release.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create release');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Create New Release</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">
            Release Date
          </label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Tracks</h2>
            <button
              type="button"
              onClick={addTrack}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Track
            </button>
          </div>

          <div className="space-y-4">
            {tracks.map((track, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-md">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={track.title}
                    onChange={(e) => updateTrack(index, 'title', e.target.value)}
                    placeholder="Track title"
                    required
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateTrack(index, 'audioFile', file);
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>
                {tracks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrack(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Release'}
          </button>
        </div>
      </form>
    </div>
  );
} 