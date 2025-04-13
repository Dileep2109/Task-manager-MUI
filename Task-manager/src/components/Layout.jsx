import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  CalendarDays,
  ClipboardList,
  User,
  ShieldCheck,
  Bell,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { useTheme } from '@/context/ThemeContext';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Paper,
} from '@mui/material';

const Layout = ({ children }) => {
  const { currentUser, logout, isAuthenticated } = useTaskContext();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDark = theme === 'dark';
  const drawerWidth = 250;

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const isPathActive = (path) => location.pathname === path;

  const toggleSidebarVisibility = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleUserLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <ClipboardList size={20} /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarDays size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    ...(currentUser?.role === 'admin'
      ? [{ path: '/admin', label: 'Admin Panel', icon: <ShieldCheck size={20} /> }]
      : []),
  ];

  const Sidebar = () => (
    <div>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          Task Manager
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit" size="small">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isPathActive(item.path)}
              onClick={() => setSidebarOpen(false)}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isPathActive(item.path) ? 'inherit' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={currentUser?.photoUrl || '/placeholder.svg'}
            alt={currentUser?.name}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle2">{currentUser?.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {currentUser?.role}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LogOut size={16} />}
          fullWidth
          onClick={handleUserLogout}
          size="small"
        >
          Logout
        </Button>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleSidebarVisibility}
        sx={{
          position: 'fixed',
          top: 8,
          left: 8,
          zIndex: 1300,
          display: { xs: 'flex', lg: 'none' },
          bgcolor: 'background.paper',
          boxShadow: 1,
          p: 1,
        }}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </IconButton>

      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={toggleSidebarVisibility}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Sidebar />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <Sidebar />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          color="default"
          sx={{
            display: { lg: 'none' },
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Task Manager
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={toggleTheme} sx={{ mr: 1 }}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
              <IconButton>
                <Bell size={20} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Paper
          elevation={0}
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            p: { xs: 2, sm: 3 },
            mt: 2,
            mb: 4,
            borderRadius: 2,
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;