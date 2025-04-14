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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
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
  async getArtistProfile(userId: string): Promise<ArtistProfile> {
    const response = await this.api.get<ArtistProfile>(`/artist-profiles/${userId}`);
    return response.data;
  }

  async updateArtistProfile(userId: string, profile: Partial<ArtistProfile>): Promise<ArtistProfile> {
    const response = await this.api.put<ArtistProfile>(`/artist-profiles/${userId}`, profile);
    return response.data;
  }

  // Fan profile endpoints
  async getFanProfile(userId: string): Promise<FanProfile> {
    const response = await this.api.get<FanProfile>(`/fan-profiles/${userId}`);
    return response.data;
  }

  async updateFanProfile(userId: string, profile: Partial<FanProfile>): Promise<FanProfile> {
    const response = await this.api.put<FanProfile>(`/fan-profiles/${userId}`, profile);
    return response.data;
  }

  // Release endpoints
  async getReleases(page = 0, size = 20): Promise<Release[]> {
    const response = await this.api.get<Release[]>('/releases/public', { 
      params: { page, size } 
    });
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

  async getArtistReleases(artistId: string): Promise<Release[]> {
    const response = await this.api.get<Release[]>(`/releases/artist/${artistId}`);
    return response.data;
  }

  // Track endpoints
  async addTrack(releaseId: number, track: Partial<Track>): Promise<Track> {
    const response = await this.api.post<Track>(`/releases/${releaseId}/tracks`, track);
    return response.data;
  }

  // Audio file endpoints
  async uploadAudioFile(file: File): Promise<AudioFile> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.api.post<AudioFile>('/audio-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getAudioFile(id: number): Promise<AudioFile> {
    const response = await this.api.get<AudioFile>(`/audio-files/${id}`);
    return response.data;
  }
}

export const apiService = new ApiService(); 