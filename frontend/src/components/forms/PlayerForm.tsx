import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  MenuItem,
  Grid,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { createPlayerSchema, type CreatePlayerFormData } from '@/validators/player.validator';
import { Position } from '@/types';
import { useTeams } from '@/hooks/use-teams';

interface PlayerFormProps {
  onSubmit: (data: CreatePlayerFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function PlayerForm({ onSubmit, isSubmitting = false, onCancel }: PlayerFormProps) {
  const { data: teams } = useTeams();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePlayerFormData>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      position: 'PG',
      jerseyNumber: '',
      height: '',
      weight: '',
      birthDate: '',
      teamId: '',
    },
  });

  const handleFormSubmit = (data: CreatePlayerFormData) => {
    const cleaned = {
      ...data,
      jerseyNumber: data.jerseyNumber === '' ? undefined : data.jerseyNumber,
      height: data.height === '' ? undefined : data.height,
      weight: data.weight === '' ? undefined : data.weight,
      birthDate: data.birthDate === '' ? undefined : data.birthDate,
      teamId: data.teamId === '' ? undefined : data.teamId,
    };
    onSubmit(cleaned as CreatePlayerFormData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Position"
                fullWidth
                error={!!errors.position}
                helperText={errors.position?.message}
              >
                {Object.values(Position).map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="jerseyNumber"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <TextField
                {...field}
                value={value === '' ? '' : value}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === '' ? '' : Number(val));
                }}
                label="Jersey Number"
                type="number"
                fullWidth
                error={!!errors.jerseyNumber}
                helperText={errors.jerseyNumber?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="height"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <TextField
                {...field}
                value={value === '' ? '' : value}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === '' ? '' : Number(val));
                }}
                label="Height (cm)"
                type="number"
                fullWidth
                error={!!errors.height}
                helperText={errors.height?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="weight"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <TextField
                {...field}
                value={value === '' ? '' : value}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === '' ? '' : Number(val));
                }}
                label="Weight (kg)"
                type="number"
                fullWidth
                error={!!errors.weight}
                helperText={errors.weight?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Birth Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.birthDate}
                helperText={errors.birthDate?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="teamId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Team"
                fullWidth
                error={!!errors.teamId}
                helperText={errors.teamId?.message}
              >
                <MenuItem value="">No Team</MenuItem>
                {teams?.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        {onCancel && (
          <Button onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
        >
          {isSubmitting ? 'Creating...' : 'Create Player'}
        </Button>
      </Box>
    </form>
  );
}
