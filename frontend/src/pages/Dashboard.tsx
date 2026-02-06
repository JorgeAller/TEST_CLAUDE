import { useEffect } from 'react';
import { usePlayers } from '@/hooks/use-players';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { notify } from '@/lib/toast';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { AnimatedCard } from '@/components/animation/AnimatedCard';
import { PlayerHighlightsCarousel } from '@/components/carousel/PlayerHighlightsCarousel';
import { DraggableWidget } from '@/components/dashboard/DraggableWidget';
import { useDashboardLayout } from '@/hooks/use-dashboard-layout';
import { useTour } from '@/components/tour/TourProvider';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export function Dashboard() {
  const navigate = useNavigate();
  const { data: players, isLoading, isError, error, refetch } = usePlayers();
  const { widgets, reorderWidgets } = useDashboardLayout();
  const { startTour } = useTour();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (isError) {
      notify.error('Dashboard Error', error?.message || 'Failed to load dashboard');
    }
  }, [isError, error]);

  if (isLoading) {
    return <DashboardSkeleton />;
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
        {error?.message || 'Failed to load dashboard'}
      </Alert>
    );
  }

  const featuredPlayers = players?.slice(0, 3) || [];
  const allPlayers = players || [];
  const totalPlayers = players?.length || 0;

  const stats = [
    {
      title: 'Total Players',
      value: totalPlayers,
      icon: <PeopleIcon />,
      color: '#6B9080',
      bgColor: 'rgba(107, 144, 128, 0.12)',
    },
    {
      title: 'Active Teams',
      value: '8',
      icon: <TrophyIcon />,
      color: '#A8AEDD',
      bgColor: 'rgba(168, 174, 221, 0.12)',
    },
    {
      title: 'Games Played',
      value: '156',
      icon: <SpeedIcon />,
      color: '#7FB285',
      bgColor: 'rgba(127, 178, 133, 0.12)',
    },
    {
      title: 'Avg PPG',
      value: '24.5',
      icon: <TrendingUpIcon />,
      color: '#C4A57B',
      bgColor: 'rgba(196, 165, 123, 0.12)',
    },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = widgets.indexOf(active.id as string);
      const newIndex = widgets.indexOf(over.id as string);
      reorderWidgets(oldIndex, newIndex);
    }
  };

  const widgetContent: Record<string, React.ReactNode> = {
    stats: (
      <Box data-tour="stat-cards">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <AnimatedCard index={index} disableLayout>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: stat.bgColor,
                          color: stat.color,
                          width: 56,
                          height: 56,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" fontWeight={600}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    ),
    highlights: (
      <Box sx={{ mb: 4 }}>
        {allPlayers.length > 0 && (
          <PlayerHighlightsCarousel players={allPlayers} />
        )}
      </Box>
    ),
    featured: (
      <Box data-tour="featured-players">
        <Typography
          variant="h5"
          fontWeight={600}
          gutterBottom
          sx={{ mb: 3 }}
        >
          Featured Players
        </Typography>
        <Grid container spacing={3}>
          {featuredPlayers.map((player, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={player.id}>
              <AnimatedCard index={index + 4} disableLayout>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.02)',
                      boxShadow: 8,
                    },
                  }}
                  onClick={() => navigate(`/players/${player.id}`)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: 'primary.main',
                          fontSize: '1.5rem',
                          fontWeight: 600,
                        }}
                      >
                        {player.firstName[0]}
                        {player.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {player.firstName} {player.lastName}
                        </Typography>
                        <Box display="flex" gap={1} mt={0.5}>
                          <Chip label={player.position} size="small" color="primary" />
                          {player.jerseyNumber && (
                            <Chip label={`#${player.jerseyNumber}`} size="small" variant="outlined" />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    {player.team && (
                      <Typography variant="body2" color="text.secondary">
                        {player.team.name}
                      </Typography>
                    )}
                    {player.height && player.weight && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {player.height} cm - {player.weight} kg
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    ),
  };

  return (
    <Box>
      {/* Hero Section - Fixed (not draggable) */}
      <Box
        data-tour="hero-section"
        sx={{
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #6B9080 0%, #7FA99B 100%)'
              : 'linear-gradient(135deg, #577568 0%, #6A8E82 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h3" fontWeight={600} gutterBottom>
              Basketball Statistics Dashboard
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 400 }}>
              Professional analytics and player insights
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<HelpOutlineIcon />}
            onClick={() => startTour('dashboard')}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Take Tour
          </Button>
        </Box>
      </Box>

      {/* Draggable Widget Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets} strategy={verticalListSortingStrategy}>
          {widgets.map((widgetId) => (
            <DraggableWidget key={widgetId} id={widgetId}>
              {widgetContent[widgetId]}
            </DraggableWidget>
          ))}
        </SortableContext>
      </DndContext>

      {players && players.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No players found
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/players')}
          >
            Add Players
          </Button>
        </Box>
      )}
    </Box>
  );
}
