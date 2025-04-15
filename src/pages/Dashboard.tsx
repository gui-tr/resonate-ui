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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        {user?.userType === 'artist' && (
          <Link
            to="/artist/releases/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            New Release
          </Link>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Releases</h2>
        </div>
        {isLoading ? (
          <div className="px-6 py-5">Loading...</div>
        ) : !releases || releases.length === 0 ? (
          <div className="px-6 py-5 text-gray-500">No releases yet</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {releases.map((release) => (
              <li key={release.id}>
                <Link to={`/releases/${release.id}`} className="block hover:bg-gray-50 transition-colors">
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-indigo-600 truncate">{release.title}</p>
                      <div className="ml-4 flex-shrink-0 flex">
                        <p className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {format(new Date(release.releaseDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 sm:flex sm:justify-between">
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
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <Link to="/releases" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            View all releases
          </Link>
        </div>
      </div>
    </div>
  );
} 