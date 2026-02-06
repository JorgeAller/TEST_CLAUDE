import { useParams } from 'react-router-dom';
import { usePlayer, usePlayerStats, usePlayerAdvancedMetrics } from '@/hooks/use-players';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
  Button,
  Avatar,
  Chip,
  Grid,
  Paper,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Height as HeightIcon,
  FitnessCenter as WeightIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { PlayerDetailSkeleton } from '@/components/skeletons/PlayerDetailSkeleton';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const { data: player, isLoading: playerLoading, isError: playerError } = usePlayer(id!);
  const { data: seasonStats, isLoading: statsLoading } = usePlayerStats(id!, '2023-24');
  const { data: advancedMetrics } = usePlayerAdvancedMetrics(id!, '2023-24');

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  if (playerLoading) {
    return <PlayerDetailSkeleton />;
  }

  if (playerError || !player) {
    return (
      <Alert severity="error">
        Player not found
      </Alert>
    );
  }

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/players')}
        sx={{ mb: 3 }}
      >
        Back to Players
      </Button>

      {/* Player Header */}
      <Card
        sx={{
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #6B9080 0%, #7FA99B 100%)'
              : 'linear-gradient(135deg, #577568 0%, #6A8E82 100%)',
          color: 'white',
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: '2.5rem',
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '4px solid rgba(255,255,255,0.3)',
              }}
            >
              {player.firstName[0]}
              {player.lastName[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {player.firstName} {player.lastName}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={player.position}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                {player.jerseyNumber && (
                  <Chip
                    label={`#${player.jerseyNumber}`}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                )}
                {player.team && (
                  <Chip
                    label={player.team.name}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {(player.height || player.weight) && (
            <Box display="flex" gap={4} mt={3} pt={3} borderTop="1px solid rgba(255,255,255,0.2)">
              {player.height && (
                <Box display="flex" alignItems="center" gap={1}>
                  <HeightIcon />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Height
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {player.height} cm
                    </Typography>
                  </Box>
                </Box>
              )}
              {player.weight && (
                <Box display="flex" alignItems="center" gap={1}>
                  <WeightIcon />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Weight
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {player.weight} kg
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Season Stats" />
          <Tab label="Advanced Metrics" />
          <Tab label="Game Log" />
        </Tabs>
        <Divider />

        <TabPanel value={tabValue} index={0}>
          {statsLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : seasonStats ? (
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                2023-24 Season Statistics
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[
                  { label: 'PPG', value: Number(seasonStats.avgPoints).toFixed(1) },
                  { label: 'RPG', value: Number(seasonStats.avgRebounds).toFixed(1) },
                  { label: 'APG', value: Number(seasonStats.avgAssists).toFixed(1) },
                  { label: 'MPG', value: Number(seasonStats.avgMinutes).toFixed(1) },
                  {
                    label: 'FG%',
                    value: seasonStats.fieldGoalPercentage
                      ? (Number(seasonStats.fieldGoalPercentage) * 100).toFixed(1) + '%'
                      : '0.0%',
                  },
                  {
                    label: '3P%',
                    value: seasonStats.threePointPercentage
                      ? (Number(seasonStats.threePointPercentage) * 100).toFixed(1) + '%'
                      : '0.0%',
                  },
                  {
                    label: 'FT%',
                    value: seasonStats.freeThrowPercentage
                      ? (Number(seasonStats.freeThrowPercentage) * 100).toFixed(1) + '%'
                      : '0.0%',
                  },
                ].map((stat, index) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {stat.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Typography color="text.secondary">No statistics available for this season.</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {advancedMetrics ? (
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Advanced Metrics
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[
                  {
                    label: 'True Shooting %',
                    value: advancedMetrics.trueShootingPercentage
                      ? (Number(advancedMetrics.trueShootingPercentage) * 100).toFixed(1) + '%'
                      : '0.0%',
                  },
                  {
                    label: 'PER',
                    value: advancedMetrics.playerEfficiencyRating
                      ? Number(advancedMetrics.playerEfficiencyRating).toFixed(1)
                      : '0.0',
                  },
                  {
                    label: 'Offensive Rating',
                    value: advancedMetrics.offensiveRating
                      ? Number(advancedMetrics.offensiveRating).toFixed(1)
                      : '0.0',
                  },
                  {
                    label: 'Defensive Rating',
                    value: advancedMetrics.defensiveRating
                      ? Number(advancedMetrics.defensiveRating).toFixed(1)
                      : '0.0',
                  },
                ].map((stat, index) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="secondary">
                        {stat.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Typography color="text.secondary">No advanced metrics available.</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography color="text.secondary">Game log coming soon...</Typography>
        </TabPanel>
      </Card>
    </Box>
  );
}
