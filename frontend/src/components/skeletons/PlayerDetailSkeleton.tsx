import Skeleton from 'react-loading-skeleton';
import { Box, Card, CardContent, Grid } from '@mui/material';

export function PlayerDetailSkeleton() {
  return (
    <Box>
      {/* Back Button Skeleton */}
      <Skeleton width={140} height={36} style={{ marginBottom: 24 }} borderRadius={10} />

      {/* Player Header Card Skeleton */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Skeleton circle width={100} height={100} />
            <Box flex={1}>
              <Skeleton width="40%" height={40} />
              <Box display="flex" gap={1} mt={1}>
                <Skeleton width={60} height={28} borderRadius={12} />
                <Skeleton width={50} height={28} borderRadius={12} />
                <Skeleton width={120} height={28} borderRadius={12} />
              </Box>
            </Box>
          </Box>
          <Box display="flex" gap={4} mt={3} pt={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <Skeleton circle width={24} height={24} />
              <Box>
                <Skeleton width={50} height={14} />
                <Skeleton width={60} height={24} />
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Skeleton circle width={24} height={24} />
              <Box>
                <Skeleton width={50} height={14} />
                <Skeleton width={60} height={24} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <Card>
        <Box display="flex" gap={2} p={2}>
          <Skeleton width={100} height={36} />
          <Skeleton width={130} height={36} />
          <Skeleton width={80} height={36} />
        </Box>
        <Box p={3}>
          <Skeleton width={250} height={28} style={{ marginBottom: 16 }} />
          <Grid container spacing={2}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                <Skeleton height={80} borderRadius={16} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
}
