import useEmblaCarousel from 'embla-carousel-react';
import { Box, Paper, Typography } from '@mui/material';

interface StatItem {
  label: string;
  value: string;
  color?: string;
}

interface StatsCarouselProps {
  stats: StatItem[];
}

export function StatsCarousel({ stats }: StatsCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 2,
  });

  return (
    <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{
              flex: '0 0 45%',
              minWidth: 0,
            }}
          >
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h4" fontWeight={700} color={stat.color || 'primary'}>
                {stat.value}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
