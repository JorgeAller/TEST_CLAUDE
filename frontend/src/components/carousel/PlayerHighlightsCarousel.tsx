import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Player } from '@/types';

interface PlayerHighlightsCarouselProps {
  players: Player[];
}

export function PlayerHighlightsCarousel({ players }: PlayerHighlightsCarouselProps) {
  const navigate = useNavigate();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!players.length) return null;

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pr: 5 }}>
        <Typography variant="h5" fontWeight={600}>
          Player Highlights
        </Typography>
        <Box>
          <IconButton onClick={scrollPrev} size="small">
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={scrollNext} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {players.map((player) => (
            <Box
              key={player.id}
              sx={{
                flex: { xs: '0 0 100%', sm: '0 0 50%', md: '0 0 33.333%' },
                minWidth: 0,
                px: 0.5,
              }}
            >
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
                    <Box>
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {player.firstName} {player.lastName}
                      </Typography>
                      <Box display="flex" gap={0.5} mt={0.5}>
                        <Chip label={player.position} size="small" color="primary" />
                        {player.jerseyNumber != null && (
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
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
