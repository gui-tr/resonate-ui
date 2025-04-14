export interface User {
  userId: string;
  email: string;
  userType: 'artist' | 'fan';
  bio?: string;
}

export interface ArtistProfile {
  userId: string;
  biography: string;
}

export interface FanProfile {
  userId: string;
  subscriptionActive: boolean;
}

export interface Release {
  id: number;
  artistId: string;
  title: string;
  releaseDate: string;
  upc?: string;
  tracks?: Track[];
}

export interface Track {
  id: number;
  title: string;
  duration: number;
  isrc?: string;
  filePath: string;
  fileSize: number;
  release?: Release;
}

export interface AudioFile {
  id: number;
  fileIdentifier: string;
  fileUrl: string;
  fileSize: number;
  checksum: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  userType: 'artist' | 'fan';
  emailVerified: boolean;
}

export interface ApiError {
  message: string;
  status: number;
} 