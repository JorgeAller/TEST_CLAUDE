import React from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { useTheme } from '@mui/material/styles';

interface SkeletonThemeWrapperProps {
  children: React.ReactNode;
}

export function SkeletonThemeWrapper({ children }: SkeletonThemeWrapperProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <SkeletonTheme
      baseColor={isDark ? '#2A2E3B' : '#E8E8E8'}
      highlightColor={isDark ? '#3A3F4E' : '#F5F5F5'}
    >
      {children}
    </SkeletonTheme>
  );
}
