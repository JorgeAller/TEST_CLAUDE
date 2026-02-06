import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { TourProvider } from '@/components/tour/TourProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { CommandPalette } from '@/components/command-palette/CommandPalette';
import { PageTransition } from '@/components/animation/PageTransition';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { PlayersPageSkeleton } from '@/components/skeletons/PlayersPageSkeleton';
import { PlayerDetailSkeleton } from '@/components/skeletons/PlayerDetailSkeleton';

// Lazy-loaded route components for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const PlayersPage = lazy(() => import('@/pages/PlayersPage').then(m => ({ default: m.PlayersPage })));
const PlayerDetailPage = lazy(() => import('@/pages/PlayerDetailPage').then(m => ({ default: m.PlayerDetailPage })));

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <PageTransition><Dashboard /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/players"
          element={
            <Suspense fallback={<PlayersPageSkeleton />}>
              <PageTransition><PlayersPage /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/players/:id"
          element={
            <Suspense fallback={<PlayerDetailSkeleton />}>
              <PageTransition><PlayerDetailPage /></PageTransition>
            </Suspense>
          }
        />
        <Route path="/teams" element={<PageTransition><div>Teams page coming soon...</div></PageTransition>} />
        <Route path="/games" element={<PageTransition><div>Coming soon...</div></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TourProvider>
          <ToastProvider />
          <Router>
            <CommandPalette />
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </Router>
        </TourProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
