import { useState, useCallback, useMemo } from 'react';
import { usePlayers } from '@/hooks/use-players';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  Button,
  TextField,
  MenuItem,
  Avatar,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Position } from '@/types';
import { PlayersPageSkeleton } from '@/components/skeletons/PlayersPageSkeleton';
import { AnimatedCard } from '@/components/animation/AnimatedCard';
import { AddPlayerDialog } from '@/components/forms/AddPlayerDialog';

export function PlayersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { data: players, isLoading, isError, error, refetch } = usePlayers();

  const handleOpenAddDialog = useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setAddDialogOpen(false);
  }, []);

  // Memoize filtered players to avoid recomputing on every render
  const filteredPlayers = useMemo(() => {
    if (!players) return [];
    return players.filter((player) => {
      const matchesSearch =
        searchTerm === '' ||
        player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = positionFilter === '' || player.position === positionFilter;
      return matchesSearch && matchesPosition;
    });
  }, [players, searchTerm, positionFilter]);

  if (isLoading) {
    return <PlayersPageSkeleton />;
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        {error?.message || 'Failed to load players'}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Players
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Player
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Filter by Position"
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
              >
                <MenuItem value="">All Positions</MenuItem>
                {Object.values(Position).map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Players Grid */}
      <Grid container spacing={3}>
        {filteredPlayers.map((player, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={player.id}>
            <AnimatedCard index={index} disableLayout>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(`/players/${player.id}`)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.main',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                      }}
                    >
                      {player.firstName[0]}
                      {player.lastName[0]}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {player.firstName} {player.lastName}
                      </Typography>
                      <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                        <Chip label={player.position} size="small" color="primary" />
                        {player.jerseyNumber != null && (
                          <Chip
                            label={`#${player.jerseyNumber}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {player.team ? (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        {player.team.abbreviation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ·
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {player.team.name}
                      </Typography>
                    </Box>
                  ) : null}

                  {player.height && player.weight ? (
                    <Typography variant="body2" color="text.secondary">
                      {player.height} cm · {player.weight} kg
                    </Typography>
                  ) : null}

                  <Box
                    mt={2}
                    pt={2}
                    borderTop={1}
                    borderColor="divider"
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight={600}
                      sx={{
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      View Stats →
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>

      {filteredPlayers.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No players found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {/* Add Player Dialog */}
      <AddPlayerDialog open={addDialogOpen} onClose={handleCloseAddDialog} />
    </Box>
  );
}
