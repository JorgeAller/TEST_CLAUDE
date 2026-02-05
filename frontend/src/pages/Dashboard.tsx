import { usePlayers } from '@/hooks/use-players';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const { data: players, isLoading, isError, error, refetch } = usePlayers();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
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
  const totalPlayers = players?.length || 0;

  const stats = [
    {
      title: 'Total Players',
      value: totalPlayers,
      icon: <PeopleIcon />,
      color: '#6B9080', // Sage Green
      bgColor: 'rgba(107, 144, 128, 0.12)',
    },
    {
      title: 'Active Teams',
      value: '8',
      icon: <TrophyIcon />,
      color: '#A8AEDD', // Soft Lavender
      bgColor: 'rgba(168, 174, 221, 0.12)',
    },
    {
      title: 'Games Played',
      value: '156',
      icon: <SpeedIcon />,
      color: '#7FB285', // Mint
      bgColor: 'rgba(127, 178, 133, 0.12)',
    },
    {
      title: 'Avg PPG',
      value: '24.5',
      icon: <TrendingUpIcon />,
      color: '#C4A57B', // Warm Terracotta
      bgColor: 'rgba(196, 165, 123, 0.12)',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #6B9080 0%, #7FA99B 100%)'
              : 'linear-gradient(135deg, #577568 0%, #6A8E82 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          opacity: 0,
          animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        }}
      >
        <Typography variant="h3" fontWeight={600} gutterBottom>
          Basketball Statistics Dashboard
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 400 }}>
          Professional analytics and player insights
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                animationDelay: `${0.1 + index * 0.1}s`,
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
          </Grid>
        ))}
      </Grid>

      {/* Featured Players */}
      <Typography
        variant="h5"
        fontWeight={600}
        gutterBottom
        sx={{
          mb: 3,
          opacity: 0,
          animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          animationDelay: '0.5s',
        }}
      >
        Featured Players
      </Typography>
      <Grid container spacing={3}>
        {featuredPlayers.map((player, index) => (
          <Grid item xs={12} md={4} key={player.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                animationDelay: `${0.6 + index * 0.1}s`,
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
                    {player.height} cm • {player.weight} kg
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
