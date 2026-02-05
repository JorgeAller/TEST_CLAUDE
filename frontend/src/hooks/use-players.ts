import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { playersApi } from '@/lib/api-client';
import type { Player, PlayerSeasonStats, AdvancedMetrics, PlayerGameStats } from '@/types';

// Query keys
export const playerKeys = {
  all: ['players'] as const,
  lists: () => [...playerKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...playerKeys.lists(), filters] as const,
  details: () => [...playerKeys.all, 'detail'] as const,
  detail: (id: string) => [...playerKeys.details(), id] as const,
  stats: (id: string, season?: string) => [...playerKeys.detail(id), 'stats', season] as const,
  advanced: (id: string, season?: string) => [...playerKeys.detail(id), 'advanced', season] as const,
  gameLog: (id: string, season?: string) => [...playerKeys.detail(id), 'gameLog', season] as const,
};

// Get all players
export function usePlayers(
  filters?: Record<string, string | number | boolean>,
  options?: Omit<UseQueryOptions<Player[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Player[]>({
    queryKey: playerKeys.list(filters),
    queryFn: () => playersApi.getAll(filters),
    ...options,
  });
}

// Get single player
export function usePlayer(
  id: string,
  options?: Omit<UseQueryOptions<Player>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Player>({
    queryKey: playerKeys.detail(id),
    queryFn: () => playersApi.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Get player season stats
export function usePlayerStats(
  id: string,
  season?: string,
  options?: Omit<UseQueryOptions<PlayerSeasonStats>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PlayerSeasonStats>({
    queryKey: playerKeys.stats(id, season),
    queryFn: () => playersApi.getStats(id, season),
    enabled: !!id,
    ...options,
  });
}

// Get player advanced metrics
export function usePlayerAdvancedMetrics(
  id: string,
  season?: string,
  options?: Omit<UseQueryOptions<AdvancedMetrics>, 'queryKey' | 'queryFn'>
) {
  return useQuery<AdvancedMetrics>({
    queryKey: playerKeys.advanced(id, season),
    queryFn: () => playersApi.getAdvancedMetrics(id, season),
    enabled: !!id,
    ...options,
  });
}

// Get player game log
export function usePlayerGameLog(
  id: string,
  season?: string,
  options?: Omit<UseQueryOptions<PlayerGameStats[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PlayerGameStats[]>({
    queryKey: playerKeys.gameLog(id, season),
    queryFn: () => playersApi.getGameLog(id, season),
    enabled: !!id,
    ...options,
  });
}

// Combined hook for player with stats
export function usePlayerWithStats(id: string, season?: string) {
  const playerQuery = usePlayer(id);
  const statsQuery = usePlayerStats(id, season);
  const advancedQuery = usePlayerAdvancedMetrics(id, season);

  return {
    player: playerQuery.data,
    seasonStats: statsQuery.data,
    advancedMetrics: advancedQuery.data,
    isLoading: playerQuery.isLoading || statsQuery.isLoading || advancedQuery.isLoading,
    isError: playerQuery.isError || statsQuery.isError || advancedQuery.isError,
    error: playerQuery.error || statsQuery.error || advancedQuery.error,
  };
}
