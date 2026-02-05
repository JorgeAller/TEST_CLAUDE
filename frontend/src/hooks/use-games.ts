import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { gamesApi } from '@/lib/api-client';
import type { Game } from '@/types';

// Query keys
export const gameKeys = {
  all: ['games'] as const,
  lists: () => [...gameKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...gameKeys.lists(), filters] as const,
  details: () => [...gameKeys.all, 'detail'] as const,
  detail: (id: string) => [...gameKeys.details(), id] as const,
  boxScore: (id: string) => [...gameKeys.detail(id), 'boxscore'] as const,
};

// Get all games
export function useGames(
  filters?: Record<string, string | number | boolean>,
  options?: Omit<UseQueryOptions<Game[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Game[]>({
    queryKey: gameKeys.list(filters),
    queryFn: () => gamesApi.getAll(filters),
    ...options,
  });
}

// Get single game
export function useGame(
  id: string,
  options?: Omit<UseQueryOptions<Game>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Game>({
    queryKey: gameKeys.detail(id),
    queryFn: () => gamesApi.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Get game box score
export function useGameBoxScore(
  id: string,
  options?: Omit<UseQueryOptions<unknown>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: gameKeys.boxScore(id),
    queryFn: () => gamesApi.getBoxScore(id),
    enabled: !!id,
    ...options,
  });
}
