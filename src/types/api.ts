export interface User {
  userId: string;
  email: string;
  userType: 'artist' | 'fan';
  bio?: string;
}

export interface ArtistProfile {
  userId: string;
  biography: string;
  socialLinks: Record<string, string>;
  createdAt: string;
}

export interface FanProfile {
  userId: string;
  subscriptionActive: boolean;
  subscriptionStartDate: string;
  createdAt: string;
}

export interface Release {
  id: number;
  artistId: string;
  title: string;
  releaseDate: string;
  upc?: string;
  createdAt: string;
  tracks?: Track[];
}

export interface Track {
  id: number;
  title: string;
  duration: number;
  isrc?: string;
  filePath: string;
  fileSize: number;
  audioFile?: AudioFile;
  createdAt: string;
}

export interface AudioFile {
  id: number;
  fileIdentifier: string;
  fileUrl: string;
  fileSize: number;
  checksum: string;
  createdAt: string;
}

export interface AuthResponse {
  userId: string;
  token: string;
  userType?: 'artist' | 'fan';
}

export interface ApiError {
  message: string;
  status: number;
} 