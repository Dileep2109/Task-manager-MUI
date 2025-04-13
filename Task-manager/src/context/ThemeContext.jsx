import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const createAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#9b87f5' : '#2196F3' },
      secondary: { main: mode === 'dark' ? '#7E69AB' : '#9C27B0' },
      success: { main: '#4CAF50' },
      warning: { main: '#FFC107' },
      error: { main: '#F44336' },
      background: { default: mode === 'dark' ? '#121212' : '#f5f5f5', paper: mode === 'dark' ? '#1e1e1e' : '#ffffff' },
      text: { primary: mode === 'dark' ? '#ffffff' : '#000000', secondary: mode === 'dark' ? '#b0b0b0' : '#666666' },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          body: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            transition: 'all 0.3s ease',
          },
          '*::-webkit-scrollbar': { width: '8px', height: '8px' },
          '*::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc', borderRadius: '4px' },
          '*::-webkit-scrollbar-track': { backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f1f1f1' },
        }),
      },
      MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
      MuiCard: { styleOverrides: { root: { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' } } },
      MuiPaper: { styleOverrides: { root: { transition: 'background-color 0.3s ease, color 0.3s ease' } } },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
    },
  });

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem('theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.classList.add(mode);
    document.documentElement.classList.remove(mode === 'dark' ? 'light' : 'dark');
  }, [mode]);

  const toggleTheme = () => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme: mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
