import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { format } from 'date-fns';

export function Dashboard() {
  const { user } = useAuth();
  const { data: releases, isLoading } = useQuery({
    queryKey: ['releases', 'recent'],
    queryFn: () => apiService.getReleases(0, 5)
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {user?.userType === 'artist' && (
          <Link
            to="/artist/releases/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            New Release
          </Link>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Releases</h2>
        </div>
        {isLoading ? (
          <div className="px-4 py-5 sm:px-6">Loading...</div>
        ) : !releases || releases.length === 0 ? (
          <div className="px-4 py-5 sm:px-6 text-gray-500">No releases yet</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {releases.map((release) => (
              <li key={release.id}>
                <Link to={`/releases/${release.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{release.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {format(new Date(release.releaseDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {release.tracks?.length || 0} tracks
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <Link to="/releases" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all releases
          </Link>
        </div>
      </div>
    </div>
  );
} 