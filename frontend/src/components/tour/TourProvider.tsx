import React, { createContext, useContext, useState, useCallback } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useTheme } from '@mui/material/styles';

const TOUR_STORAGE_PREFIX = 'tour-completed-';

interface TourContextType {
  startTour: (tourName: string) => void;
  isTourCompleted: (tourName: string) => boolean;
  resetTour: (tourName: string) => void;
}

const TourContext = createContext<TourContextType>({
  startTour: () => {},
  isTourCompleted: () => false,
  resetTour: () => {},
});

export const useTour = () => useContext(TourContext);

const tourDefinitions: Record<string, Step[]> = {
  dashboard: [
    {
      target: '[data-tour="hero-section"]',
      content: 'Welcome to the Basketball Statistics Dashboard! This is your main overview of the platform.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="stat-cards"]',
      content: 'Here you can see key statistics at a glance: total players, active teams, games played, and average points per game.',
    },
    {
      target: '[data-tour="featured-players"]',
      content: 'Featured players are highlighted here. Click on any player card to see their detailed statistics.',
    },
  ],
  advancedMetrics: [
    {
      target: '[data-tour="ts-pct"]',
      content: 'True Shooting % measures shooting efficiency accounting for 2-pointers, 3-pointers, and free throws.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="per"]',
      content: 'Player Efficiency Rating (PER) is a comprehensive statistic that sums up all a player\'s contributions into one number.',
    },
    {
      target: '[data-tour="ratings"]',
      content: 'Offensive and Defensive Ratings estimate how many points a player produces/allows per 100 possessions.',
    },
  ],
};

interface TourProviderProps {
  children: React.ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const theme = useTheme();
  const [activeTour, setActiveTour] = useState<string | null>(null);
  const [run, setRun] = useState(false);

  const isTourCompleted = useCallback((tourName: string) => {
    return localStorage.getItem(`${TOUR_STORAGE_PREFIX}${tourName}`) === 'true';
  }, []);

  const startTour = useCallback((tourName: string) => {
    if (tourDefinitions[tourName]) {
      setActiveTour(tourName);
      setRun(true);
    }
  }, []);

  const resetTour = useCallback((tourName: string) => {
    localStorage.removeItem(`${TOUR_STORAGE_PREFIX}${tourName}`);
  }, []);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status } = data;
      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        setRun(false);
        if (activeTour) {
          localStorage.setItem(`${TOUR_STORAGE_PREFIX}${activeTour}`, 'true');
        }
        setActiveTour(null);
      }
    },
    [activeTour]
  );

  const steps = activeTour ? tourDefinitions[activeTour] || [] : [];

  return (
    <TourContext.Provider value={{ startTour, isTourCompleted, resetTour }}>
      {children}
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: theme.palette.primary.main,
            textColor: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            arrowColor: theme.palette.background.paper,
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif',
          },
          buttonNext: {
            borderRadius: 8,
            fontFamily: 'DM Sans, sans-serif',
          },
          buttonBack: {
            borderRadius: 8,
            fontFamily: 'DM Sans, sans-serif',
          },
          buttonSkip: {
            borderRadius: 8,
            fontFamily: 'DM Sans, sans-serif',
          },
        }}
      />
    </TourContext.Provider>
  );
}
