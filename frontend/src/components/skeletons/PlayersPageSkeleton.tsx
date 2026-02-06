import Skeleton from 'react-loading-skeleton';
import { Box, Grid, Card, CardContent } from '@mui/material';

export function PlayersPageSkeleton() {
  return (
    <Box>
      {/* Header Skeleton */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Skeleton width={120} height={36} />
        <Skeleton width={140} height={42} borderRadius={10} />
      </Box>

      {/* Filters Skeleton */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Skeleton height={56} borderRadius={16} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Skeleton height={56} borderRadius={16} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Player Cards Skeleton */}
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Skeleton circle width={56} height={56} />
                  <Box flex={1}>
                    <Skeleton width="70%" height={24} />
                    <Box display="flex" gap={0.5} mt={0.5}>
                      <Skeleton width={36} height={24} borderRadius={12} />
                      <Skeleton width={36} height={24} borderRadius={12} />
                    </Box>
                  </Box>
                </Box>
                <Skeleton width="60%" height={16} />
                <Skeleton width="45%" height={16} style={{ marginTop: 8 }} />
                <Box mt={2} pt={2} borderTop={1} borderColor="divider" display="flex" justifyContent="flex-end">
                  <Skeleton width={80} height={16} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
