import axios, { AxiosInstance } from 'axios';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor pour ajouter le token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor pour gérer les erreurs 401
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await this.api.post<LoginResponse>('/auth/login', credentials);
    return data;
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const { data } = await this.api.post<LoginResponse>('/auth/register', userData);
    return data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('authToken');
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await this.api.get<User>('/auth/me');
    return data;
  }

  // Character endpoints
  async getCharacters(userId: string) {
    const { data } = await this.api.get(`/characters?userId=${userId}`);
    return data;
  }

  async getCharacter(id: string) {
    const { data } = await this.api.get(`/characters/${id}`);
    return data;
  }

  async createCharacter(character: any) {
    const { data } = await this.api.post('/characters', character);
    return data;
  }

  async updateCharacter(id: string, updates: any) {
    const { data } = await this.api.put(`/characters/${id}`, updates);
    return data;
  }

  async deleteCharacter(id: string): Promise<void> {
    await this.api.delete(`/characters/${id}`);
  }

  // Campaign endpoints
  async getCampaigns(userId: string) {
    const { data } = await this.api.get(`/campaigns?userId=${userId}`);
    return data;
  }

  async getCampaign(id: string) {
    const { data } = await this.api.get(`/campaigns/${id}`);
    return data;
  }

  async createCampaign(campaign: any) {
    const { data } = await this.api.post('/campaigns', campaign);
    return data;
  }

  async updateCampaign(id: string, updates: any) {
    const { data } = await this.api.put(`/campaigns/${id}`, updates);
    return data;
  }

  async deleteCampaign(id: string): Promise<void> {
    await this.api.delete(`/campaigns/${id}`);
  }

  // Game Board endpoints
  async getGameBoard(campaignId: string) {
    const { data } = await this.api.get(`/gameboards?campaignId=${campaignId}`);
    return data;
  }

  async updateGameBoard(id: string, board: any) {
    const { data } = await this.api.put(`/gameboards/${id}`, board);
    return data;
  }

  // Utility methods
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
    delete this.api.defaults.headers.common['Authorization'];
  }
}

export const apiService = new ApiService();
