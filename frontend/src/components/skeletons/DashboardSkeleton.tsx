import Skeleton from 'react-loading-skeleton';
import { Box, Grid, Card, CardContent } from '@mui/material';

export function DashboardSkeleton() {
  return (
    <Box>
      {/* Hero Section Skeleton */}
      <Box sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        <Skeleton height={160} borderRadius={16} />
      </Box>

      {/* Stat Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Skeleton circle width={56} height={56} />
                  <Box flex={1}>
                    <Skeleton width="60%" height={16} />
                    <Skeleton width="40%" height={32} style={{ marginTop: 4 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Featured Players Title Skeleton */}
      <Skeleton width={200} height={28} style={{ marginBottom: 24 }} />

      {/* Player Cards Skeleton */}
      <Grid container spacing={3}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Skeleton circle width={64} height={64} />
                  <Box flex={1}>
                    <Skeleton width="70%" height={24} />
                    <Box display="flex" gap={1} mt={0.5}>
                      <Skeleton width={40} height={24} borderRadius={12} />
                      <Skeleton width={40} height={24} borderRadius={12} />
                    </Box>
                  </Box>
                </Box>
                <Skeleton width="50%" height={16} />
                <Skeleton width="40%" height={16} style={{ marginTop: 8 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
