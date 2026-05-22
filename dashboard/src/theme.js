import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D32F2F', // Deep Crimson
      light: '#D32F2F',
      dark: '#D32F2F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F5F5DC', // Beige / Cream
    },
    background: {
      default: '#120F0D', // Espresso Black
      paper: '#1C1816', // Roasted Bean
    },
    text: {
      primary: '#FDF5E6', // Warm Cream
      secondary: '#A09088', // Mocha Gray
    },
    divider: 'rgba(211, 47, 47, 0.15)',
  },
  typography: {
    fontFamily: '"Gotham", "Outfit"',
    h1: {
      fontFamily: '"Gotham", "Outfit"',
      fontWeight: 900,
      letterSpacing: '-1px',
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Gotham", "Outfit"',
      fontWeight: 800,
      letterSpacing: '0px',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Gotham", "Outfit"',
      fontWeight: 700,
      letterSpacing: '0px',
    },
    h4: {
      fontFamily: '"Gotham", "Outfit"',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Gotham", "Outfit"',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Gotham", "Outfit"',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Gotham", "Outfit"',
      fontWeight: 500,
      letterSpacing: '0px',
    },
    button: {
      fontFamily: '"Gotham", "Outfit"',
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'none',
    }
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '10px 28px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: 700,
          '&:hover': {
            transform: 'none',
            boxShadow: '0 8px 20px rgba(211, 47, 47, 0.3)',
          },
        },
        containedPrimary: {
          backgroundColor: '#D32F2F',
          boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)',
          '&:hover': {
            backgroundColor: '#D32F2F',
          }
        },
        outlinedPrimary: {
          borderWidth: '2px',
          borderColor: 'rgba(211, 47, 47, 0.5)',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(211, 47, 47, 0.05)',
            borderColor: '#D32F2F',
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C1816',
          borderRadius: 24,
          border: '1px solid rgba(211, 47, 47, 0.08)',
          backgroundImage: 'none',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            borderColor: 'rgba(211, 47, 47, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(18, 15, 13, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(211, 47, 47, 0.1)',
          boxShadow: 'none',
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&::selection': {
            backgroundColor: 'rgba(211, 47, 47, 0.3)',
            color: '#FFFFFF',
          }
        }
      }
    }
  },
});

export default theme;