import React, { useState, useCallback } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Groups as GroupsIcon,
  SportsBasketball as SportsBasketballIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '@/theme/ThemeProvider';

const DRAWER_WIDTH = 260;

interface NavItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const navItems: NavItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Players', icon: <PeopleIcon />, path: '/players' },
  { text: 'Teams', icon: <GroupsIcon />, path: '/teams' },
  { text: 'Games', icon: <SportsBasketballIcon />, path: '/games' },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [navigate, isMobile]);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            '&:hover': {
              transform: 'scale(1.03)',
            },
          }}
          onClick={() => handleNavigation('/')}
        >
          <SportsBasketballIcon
            sx={{
              color: 'primary.main',
              fontSize: 32,
            }}
          />
          <Typography variant="h6" fontWeight={600} color="primary">
            Basketball Stats
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 2, mt: 1, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  borderLeft: isActive ? '4px solid' : '4px solid transparent',
                  borderLeftColor: isActive ? 'primary.contrastText' : 'transparent',
                  pl: isActive ? 1.5 : 2,
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                    transform: 'translateX(4px)',
                    borderLeftColor: isActive ? 'primary.contrastText' : 'primary.main',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.contrastText' : 'text.secondary',
                    minWidth: 40,
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Sidebar footer with version */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          {/* Command palette shortcut hint */}
          <Chip
            icon={<SearchIcon sx={{ fontSize: '1rem !important' }} />}
            label="Ctrl+K"
            size="small"
            variant="outlined"
            sx={{
              mr: 1.5,
              cursor: 'pointer',
              display: { xs: 'none', sm: 'flex' },
              borderColor: 'divider',
              color: 'text.secondary',
              fontSize: '0.75rem',
              height: 28,
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
              },
              transition: 'var(--transition-fast)',
            }}
            onClick={() => {
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
            }}
          />

          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{
              transition: 'var(--transition-smooth)',
              '&:hover': {
                transform: 'rotate(180deg)',
                bgcolor: 'action.hover',
              },
            }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        {children}
      </Box>
    </Box>
  );
}
