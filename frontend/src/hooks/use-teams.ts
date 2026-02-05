import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { teamsApi } from '@/lib/api-client';
import type { Team, Player } from '@/types';

// Query keys
export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...teamKeys.lists(), filters] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
  roster: (id: string) => [...teamKeys.detail(id), 'roster'] as const,
  stats: (id: string, season?: string) => [...teamKeys.detail(id), 'stats', season] as const,
};

// Get all teams
export function useTeams(
  options?: Omit<UseQueryOptions<Team[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Team[]>({
    queryKey: teamKeys.lists(),
    queryFn: () => teamsApi.getAll(),
    ...options,
  });
}

// Get single team
export function useTeam(
  id: string,
  options?: Omit<UseQueryOptions<Team>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Team>({
    queryKey: teamKeys.detail(id),
    queryFn: () => teamsApi.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Get team roster
export function useTeamRoster(
  id: string,
  options?: Omit<UseQueryOptions<Player[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Player[]>({
    queryKey: teamKeys.roster(id),
    queryFn: () => teamsApi.getRoster(id),
    enabled: !!id,
    ...options,
  });
}

// Get team stats
export function useTeamStats(
  id: string,
  season?: string,
  options?: Omit<UseQueryOptions<unknown>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: teamKeys.stats(id, season),
    queryFn: () => teamsApi.getStats(id, season),
    enabled: !!id,
    ...options,
  });
}
