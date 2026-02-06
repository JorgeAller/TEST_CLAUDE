import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PlayerForm } from './PlayerForm';
import { useCreatePlayer } from '@/hooks/use-create-player';
import type { CreatePlayerFormData } from '@/validators/player.validator';

interface AddPlayerDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddPlayerDialog({ open, onClose }: AddPlayerDialogProps) {
  const { mutate: createPlayer, isPending } = useCreatePlayer(onClose);

  const handleSubmit = (data: CreatePlayerFormData) => {
    createPlayer(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Add New Player
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <PlayerForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
