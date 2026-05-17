import React from 'react';
import { AppBar, Toolbar, Container, Box, Typography, Button, IconButton, useScrollTrigger } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpg';

const MotionBox = motion(Box);

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 20,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    sx: {
      backgroundColor: trigger ? 'rgba(12, 10, 9, 0.7)' : 'transparent',
      backdropFilter: trigger ? 'blur(20px)' : 'none',
      borderBottom: trigger ? '1px solid rgba(184, 134, 11, 0.2)' : 'none',
      boxShadow: trigger ? '0 10px 40px rgba(0,0,0,0.4)' : 'none',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      py: trigger ? 0.5 : 2,
    }
  });
}

const Navbar = (props) => {
  const location = useLocation();

  const leftItems = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'About', path: '/about' },
  ];

  const rightItems = [
    { label: 'Location', path: '/location' },
    { label: 'Social', path: '/social' },
    { label: 'Admin', path: '/login' },
  ];

  return (
    <ElevationScroll {...props}>
      <AppBar position="fixed" sx={{ border: 'none', background: 'transparent' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'center', minHeight: { xs: 80, md: 120 }, position: 'relative' }}>

            {/* BRAND MARK - Floating Centerpiece */}
            <Box component={RouterLink} to="/" sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, md: 3 },
              textDecoration: 'none',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15,
              transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { transform: 'translateX(-50%) scale(1.05)' }
            }}>
              <Typography variant="h6" sx={{
                color: 'text.primary',
                fontWeight: 900,
                fontSize: { xs: '18px', md: '26px' },
                letterSpacing: '5px',
                display: { xs: 'none', sm: 'block' }
              }}>MUG</Typography>

              <Box sx={{
                height: { xs: 55, md: 80 },
                width: { xs: 55, md: 80 },
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 15px 50px rgba(0,0,0,0.7)',
                backgroundColor: 'white',
                border: '3px solid #D32F2F',
                p: 0.5,
                transition: '1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'rotate(360deg)' }
              }}>
                <img src={logo} alt="Logo" style={{ height: '85%', width: '85%', objectFit: 'contain' }} />
              </Box>

              <Typography variant="h6" sx={{
                color: 'text.primary',
                fontWeight: 900,
                fontSize: { xs: '18px', md: '26px' },
                letterSpacing: '5px',
                display: { xs: 'none', sm: 'block' }
              }}>SHOT</Typography>
            </Box>

            {/* SYMMETRICAL FLOATING ISLAND */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(12, 10, 9, 0.5)',
              backdropFilter: 'blur(40px)',
              px: { xs: 2, md: 4 },
              py: 1.5,
              borderRadius: '80px',
              border: '1px solid rgba(184, 134, 11, 0.25)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
              zIndex: 5,
              width: { xs: 'auto', md: '1050px' },
              justifyContent: 'space-between'
            }}>

              {/* Left Nav Cluster */}
              <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 2 }}>
                {leftItems.map((item) => (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                      fontSize: '12px',
                      fontWeight: 900,
                      px: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      whiteSpace: 'nowrap',
                      '&:hover': { color: 'primary.main', backgroundColor: 'transparent' }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {/* CENTRAL EXCLUSION ZONE (Reserved for Brand Mark) */}
              <Box sx={{ width: { xs: 0, md: 350 }, flexShrink: 0 }} />

              {/* Right Nav Cluster */}
              <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-start', gap: 2, alignItems: 'center' }}>
                {rightItems.slice(0, 2).map((item) => (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                      fontSize: '12px',
                      fontWeight: 900,
                      px: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      whiteSpace: 'nowrap',
                      '&:hover': { color: 'primary.main', backgroundColor: 'transparent' }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                {/* DISTINGUISHED ADMIN BUTTON */}
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  sx={{
                    ml: 2,
                    bgcolor: 'primary.main',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '11px',
                    letterSpacing: 1,
                    px: 3,
                    borderRadius: '20px',
                    '&:hover': {
                      bgcolor: 'white',
                      color: 'primary.main'
                    }
                  }}
                >
                  ADMIN
                </Button>
              </Box>

              {/* Mobile Menu Icon */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                <IconButton sx={{ color: 'primary.main' }}><MenuIcon fontSize="large" /></IconButton>
                <Box sx={{ width: 60 }} />
              </Box>

            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
};

export default Navbar;
