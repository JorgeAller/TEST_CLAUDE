import { createTheme, ThemeOptions } from '@mui/material/styles';

// Custom color palette - Tranquil & Refined
const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode - Sage Green & Lavender
          primary: {
            main: '#6B9080', // Sage Green
            light: '#8AAA99',
            dark: '#577568',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#A8AEDD', // Soft Lavender
            light: '#C2C4ED',
            dark: '#8E90CC',
          },
          success: {
            main: '#7FB285', // Mint
            light: '#9CC4A1',
            dark: '#669870',
          },
          warning: {
            main: '#C4A57B', // Warm Terracotta
            light: '#D4B996',
            dark: '#B08A5C',
          },
          background: {
            default: '#F3F4F0', // Soft Cream (oscurecido ligeramente)
            paper: '#FFFFFF', // Pure White para cards
          },
          text: {
            primary: '#2D3142', // Deep Charcoal
            secondary: '#6B7280', // Warm Gray
          },
          divider: 'rgba(107, 144, 128, 0.12)',
        }
      : {
          // Dark mode - Slate Blue & Warm Gray
          primary: {
            main: '#7FA99B', // Soft Teal
            light: '#99BFB2',
            dark: '#6A8E82',
            contrastText: '#1A1D29',
          },
          secondary: {
            main: '#B8B8D4', // Cool Lavender
            light: '#D0D0E8',
            dark: '#9E9EC0',
          },
          success: {
            main: '#8FBC8F', // Sage
            light: '#A9CFA9',
            dark: '#76A376',
          },
          warning: {
            main: '#D4B996', // Warm Sand
            light: '#E4D1B4',
            dark: '#C0A17D',
          },
          background: {
            default: '#1A1D29', // Deep Slate
            paper: '#252936', // Charcoal Blue
          },
          text: {
            primary: '#F0F4F8', // Soft White
            secondary: '#9CA3AF', // Cool Gray
          },
          divider: 'rgba(127, 169, 155, 0.12)',
        }),
  },
  typography: {
    fontFamily: [
      'DM Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.03)',
    '0px 4px 8px rgba(0,0,0,0.05)',
    '0px 8px 16px rgba(0,0,0,0.06)',
    '0px 12px 24px rgba(0,0,0,0.08)',
    '0px 16px 32px rgba(0,0,0,0.09)',
    '0px 20px 40px rgba(0,0,0,0.10)',
    '0px 24px 48px rgba(0,0,0,0.11)',
    '0px 28px 56px rgba(0,0,0,0.12)',
    '0px 32px 64px rgba(0,0,0,0.13)',
    '0px 36px 72px rgba(0,0,0,0.14)',
    '0px 40px 80px rgba(0,0,0,0.15)',
    '0px 44px 88px rgba(0,0,0,0.16)',
    '0px 48px 96px rgba(0,0,0,0.17)',
    '0px 52px 104px rgba(0,0,0,0.18)',
    '0px 56px 112px rgba(0,0,0,0.19)',
    '0px 60px 120px rgba(0,0,0,0.20)',
    '0px 64px 128px rgba(0,0,0,0.21)',
    '0px 68px 136px rgba(0,0,0,0.22)',
    '0px 72px 144px rgba(0,0,0,0.23)',
    '0px 76px 152px rgba(0,0,0,0.24)',
    '0px 80px 160px rgba(0,0,0,0.25)',
    '0px 84px 168px rgba(0,0,0,0.26)',
    '0px 88px 176px rgba(0,0,0,0.27)',
    '0px 92px 184px rgba(0,0,0,0.28)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0px 2px 12px rgba(0,0,0,0.08)' 
            : '0px 2px 8px rgba(0,0,0,0.15)',
          border: mode === 'light' 
            ? '1px solid rgba(107, 144, 128, 0.15)' 
            : '1px solid rgba(127, 169, 155, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0px 8px 24px rgba(0,0,0,0.12)'
              : '0px 8px 24px rgba(0,0,0,0.25)',
            borderColor: mode === 'light'
              ? 'rgba(107, 144, 128, 0.3)'
              : 'rgba(127, 169, 155, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: mode === 'light' ? '#E2E8F0' : '#334155',
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getDesignTokens(mode));
};
