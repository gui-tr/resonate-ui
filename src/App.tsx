import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Releases } from './pages/Releases';
import { ReleaseDetail } from './pages/ReleaseDetail';

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/releases" element={
                <ProtectedRoute>
                  <Layout>
                    <Releases />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/releases/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ReleaseDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <div>Profile</div>
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Artist-specific routes */}
              <Route path="/artist/releases/new" element={
                <ProtectedRoute requireArtist>
                  <Layout>
                    <div>New Release</div>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/artist/tracks/new" element={
                <ProtectedRoute requireArtist>
                  <Layout>
                    <div>New Track</div>
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Redirect root to dashboard or login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
