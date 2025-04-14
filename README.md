# Resonate - Music Streaming Platform Frontend

## Introduction

### Solution Overview
Resonate is a music streaming web application similar to Bandcamp that connects musicians with fans. This repository contains the React-based frontend that provides the user interface for artist profiles, music releases, and playback functionality.

### Project Aim & Objectives
- **Main Goal**: Create an intuitive, responsive frontend for the Resonate music streaming platform
- **Key Objectives**:
  - Implement secure user authentication flow
  - Develop intuitive interfaces for browsing and playing music
  - Create artist-specific features for uploading and managing releases
  - Ensure responsive design across devices
  - Maintain clean, maintainable code architecture

## Enterprise Considerations

### Performance
- Efficient data fetching with React Query caching
- Lazy-loaded components for optimized initial load time
- Minimized re-renders with proper state management

### Scalability
- Component-based architecture allowing for feature expansion
- Consistent folder structure for easy navigation as the application grows
- Separation of concerns with dedicated service and context layers

### Robustness
- Comprehensive error handling in API requests
- Protected routes with role-based access control
- Fallback UI components for loading and error states

### Security
- JWT-based authentication flow
- Secure token storage and management
- Protected routes requiring authentication
- Role-based component rendering

### Deployment
- Currently set up for Heroku deployment
- Environment variable management for different deployment environments

## Installation & Usage Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running (see backend repository)

### Setup Steps
1. Clone the repository:
   ```
   git clone https://github.com/gui-tr/resonate-frontend.git
   cd resonate-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file with:
     ```
     VITE_API_URL=http://localhost:8080/api
     ```

### Running the Application
```
npm run dev
```

Access the frontend at http://localhost:5173

## Feature Overview

### Authentication
- **Purpose**: Manage user registration, login, and session state
- **Location**: `src/context/AuthContext.tsx` and `src/pages/Login.tsx`, `src/pages/Register.tsx`
- **Key Components**:
  - `AuthContext` - Manages auth state and operations
  - `Login` & `Register` pages - User authentication UI
  - `ProtectedRoute` - Route-based access control

### Dashboard
- **Purpose**: Provide overview of recent releases and user-specific content
- **Location**: `src/pages/Dashboard.tsx`
- **Key Features**:
  - Recent releases display
  - Quick access to user-relevant actions

### Release Browsing
- **Purpose**: Browse and search for music releases
- **Location**: `src/pages/Releases.tsx` and `src/pages/ReleaseDetail.tsx`
- **Key Features**:
  - Paginated releases list
  - Detailed view of individual releases with tracks

### Music Playback
- **Purpose**: Stream audio tracks
- **Location**: `src/pages/ReleaseDetail.tsx`
- **Key Features**:
  - Basic audio player integration with Howler.js
  - Play/pause controls for tracks

### Artist Features
- **Purpose**: Special features for artist accounts
- **Location**: Throughout app with conditional rendering
- **Key Features**:
  - Release creation/management UI
  - Track upload interface

## Known Issues & Future Enhancements

### Current Limitations
- Authentication bugs with backend communication
- CORS issues when interacting with the backend
- Basic player functionality without advanced features
- Limited artist profile management

### Planned Enhancements
- Complete authentication flow fixes
- Implement full music player with playlist support
- Enhance UI aesthetics and UX
- Add profile management for both artists and fans
- Implement search functionality
- Add music discovery features

## References
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [React Query](https://tanstack.com/query)
- [React Router](https://reactrouter.com/)
- [Howler.js](https://howlerjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
