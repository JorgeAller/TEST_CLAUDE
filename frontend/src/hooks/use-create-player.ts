import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { playerKeys } from './use-players';
import { notify } from '@/lib/toast';
import type { Player } from '@/types';
import type { CreatePlayerFormData } from '@/validators/player.validator';

export function useCreatePlayer(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlayerFormData) =>
      apiClient.post<Player>('/players', data),
    onSuccess: (player) => {
      queryClient.invalidateQueries({ queryKey: playerKeys.all });
      notify.success('Player created', `${player.firstName} ${player.lastName} has been added.`);
      onSuccess?.();
    },
    onError: (error: Error) => {
      notify.error('Failed to create player', error.message);
    },
  });
}
