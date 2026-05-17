import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import aboutImg from '../assets/about.jpeg';

const MotionBox = motion(Box);

const AboutPage = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', color: 'text.primary' }}>
      <Navbar />

      <Box sx={{ pt: 25, pb: 20 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 900, letterSpacing: 4 }}>OUR STORY</Typography>
              <Typography variant="h2" sx={{ mb: 4, mt: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>The Mug Shot Story</Typography>
            </MotionBox>
          </Box>

          <MotionBox
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            sx={{ mb: 10 }}
          >
            <Box
              component="img"
              src={aboutImg}
              alt="Mug Shot Cafe"
              sx={{
                width: '100%',
                height: { xs: '300px', md: '500px' },
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </MotionBox>

          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', lineHeight: 2, textAlign: 'center', mb: 4 }}>
              Founded in the heart of Nueva Vizcaya and opening its doors on July 11, 2025, Mug Shot Cafe is more than a destination—it's a sanctuary for the curious and the coffee-obsessed.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', lineHeight: 2, textAlign: 'center', mb: 4 }}>
              Located at Boyie Street, Buag, Bambang, Nueva Vizcaya, we started as a small dream to serve the perfect cup, born from a passion for roasting and a deep respect for local farmers.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', lineHeight: 2, textAlign: 'center' }}>
              We believe that great coffee is a conversation starter. Our space is designed to foster connection, creativity, and a moment of peace in your busy day. Each bean is selected for its unique character and roasted to highlight its intrinsic flavors. Our mission is to elevate the local coffee culture while creating a home for everyone who walks through our doors.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AboutPage;

