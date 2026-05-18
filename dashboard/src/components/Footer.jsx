import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import logo from '../assets/logo.jpg';

const Footer = () => {
  return (
    <Box sx={{
      py: 6,
      bgcolor: '#060404',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Container maxWidth="lg">
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ textAlign: 'center' }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            textAlign: 'center'
          }}>
            <Box sx={{
              height: 40,
              width: 40,
              borderRadius: '10px',
              overflow: 'hidden',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <img src={logo} alt="Mug Shot Logo" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px' }}>
              Mug Shot
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, letterSpacing: 1 }}>
            © 2026 MUG SHOT CAFE
          </Typography>
        </Stack>
      </Container>
    </Box>

  );
};

export default Footer;



