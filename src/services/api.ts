import axios, { AxiosInstance } from 'axios';
import type {
  User,
  ArtistProfile,
  FanProfile,
  Release,
  Track,
  AudioFile,
  AuthResponse,
  ApiError
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async register(email: string, password: string, userType: 'artist' | 'fan', bio?: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', { email, password, userType, bio });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  }

  // Artist profile endpoints
  async getArtistProfile(): Promise<ArtistProfile> {
    const response = await this.api.get<ArtistProfile>('/artist-profiles');
    return response.data;
  }

  async updateArtistProfile(profile: Partial<ArtistProfile>): Promise<ArtistProfile> {
    const response = await this.api.post<ArtistProfile>('/artist-profiles', profile);
    return response.data;
  }

  // Fan profile endpoints
  async getFanProfile(): Promise<FanProfile> {
    const response = await this.api.get<FanProfile>('/fan-profiles');
    return response.data;
  }

  async updateFanProfile(profile: Partial<FanProfile>): Promise<FanProfile> {
    const response = await this.api.post<FanProfile>('/fan-profiles', profile);
    return response.data;
  }

  // Release endpoints
  async getReleases(page = 0, size = 20): Promise<{ content: Release[]; total: number }> {
    const response = await this.api.get('/releases/public', { params: { page, size } });
    return response.data;
  }

  async getRelease(id: number): Promise<Release> {
    const response = await this.api.get<Release>(`/releases/public/${id}`);
    return response.data;
  }

  async createRelease(release: Partial<Release>): Promise<Release> {
    const response = await this.api.post<Release>('/releases', release);
    return response.data;
  }

  async updateRelease(id: number, release: Partial<Release>): Promise<Release> {
    const response = await this.api.put<Release>(`/releases/${id}`, release);
    return response.data;
  }

  async deleteRelease(id: number): Promise<void> {
    await this.api.delete(`/releases/${id}`);
  }

  // Track endpoints
  async createTrack(track: Partial<Track>, releaseId: number, audioFileId?: number): Promise<Track> {
    const response = await this.api.post<Track>('/tracks', track, {
      params: { releaseId, audioFileId }
    });
    return response.data;
  }

  async updateTrack(id: number, track: Partial<Track>, audioFileId?: number): Promise<Track> {
    const response = await this.api.put<Track>(`/tracks/${id}`, track, {
      params: { audioFileId }
    });
    return response.data;
  }

  async deleteTrack(id: number): Promise<void> {
    await this.api.delete(`/tracks/${id}`);
  }

  // Audio file endpoints
  async getUploadUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; fileKey: string; bucketName: string }> {
    const response = await this.api.get('/audio-files/upload', {
      params: { fileName, contentType }
    });
    return response.data;
  }

  async registerAudioFile(fileData: { fileKey: string; fileSize: number; checksum: string }): Promise<AudioFile> {
    const response = await this.api.post<AudioFile>('/audio-files/register', fileData);
    return response.data;
  }

  async getStreamingUrl(id: number): Promise<{ streamingUrl: string }> {
    const response = await this.api.get(`/audio-files/${id}/stream`);
    return response.data;
  }
}

export const apiService = new ApiService(); 