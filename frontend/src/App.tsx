import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { PlayersPage } from '@/pages/PlayersPage';
import { PlayerDetailPage } from '@/pages/PlayerDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/players/:id" element={<PlayerDetailPage />} />
              <Route path="/teams" element={<div>Teams page coming soon...</div>} />
              <Route path="/games" element={<div>Coming soon...</div>} />
            </Routes>
          </AppLayout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
