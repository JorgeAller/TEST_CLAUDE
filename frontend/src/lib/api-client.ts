/// <reference types="vite/client" />
import type { ApiError, Player, PlayerSeasonStats, AdvancedMetrics, PlayerGameStats, Team, Game } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetails: unknown;

    try {
      const errorData: ApiError = await response.json();
      errorMessage = errorData.message || errorMessage;
      errorDetails = errorData.details;
    } catch {
      // If response is not JSON, use default error message
    }

    throw new ApiClientError(errorMessage, response.status, errorDetails);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();
  return data.data !== undefined ? data.data : data;
}

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<T>(response);
  },
};

// Specific API endpoints
export const playersApi = {
  getAll: (params?: Record<string, string | number | boolean>): Promise<Player[]> =>
    apiClient.get<Player[]>('/players', params),
  getById: (id: string): Promise<Player> =>
    apiClient.get<Player>(`/players/${id}`),
  getStats: (id: string, season?: string): Promise<PlayerSeasonStats> =>
    apiClient.get<PlayerSeasonStats>(`/players/${id}/stats`, season ? { season } : undefined),
  getAdvancedMetrics: (id: string, season?: string): Promise<AdvancedMetrics> =>
    apiClient.get<AdvancedMetrics>(`/players/${id}/advanced`, season ? { season } : undefined),
  getGameLog: (id: string, season?: string): Promise<PlayerGameStats[]> =>
    apiClient.get<PlayerGameStats[]>(`/players/${id}/games`, season ? { season } : undefined),
};

export const teamsApi = {
  getAll: (): Promise<Team[]> =>
    apiClient.get<Team[]>('/teams'),
  getById: (id: string): Promise<Team> =>
    apiClient.get<Team>(`/teams/${id}`),
  getRoster: (id: string): Promise<Player[]> =>
    apiClient.get<Player[]>(`/teams/${id}/roster`),
  getStats: (id: string, season?: string): Promise<unknown> =>
    apiClient.get<unknown>(`/teams/${id}/stats`, season ? { season } : undefined),
};

export const gamesApi = {
  getAll: (params?: Record<string, string | number | boolean>): Promise<Game[]> =>
    apiClient.get<Game[]>('/games', params),
  getById: (id: string): Promise<Game> =>
    apiClient.get<Game>(`/games/${id}`),
  getBoxScore: (id: string): Promise<unknown> =>
    apiClient.get<unknown>(`/games/${id}/boxscore`),
};
