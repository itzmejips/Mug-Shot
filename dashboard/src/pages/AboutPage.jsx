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
              It all started with a simple belief: that a good cup of coffee can make any day a little brighter. Mug Shot wasn't born out of a big business plan. It grew from a simple dream to build a warm, cozy spot right here in Nueva Vizcaya where people could just sit, slow down, and feel at home.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', lineHeight: 2, textAlign: 'center', mb: 4 }}>
              On July 11, 2025, we finally opened our doors on Boyie Street in Bambang. We didn't have much at first—just a small space, a passion for roasting, and a deep respect for our local farmers. We wanted every cup we served to not only taste great, but to also honor the hard work of the hands that grew it.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', lineHeight: 2, textAlign: 'center' }}>
              To us, Mug Shot is so much more than a coffee shop. It's a place where conversations start, old friends catch up, and new ideas are born. Whether you are here to work, to laugh with friends, or just to enjoy a quiet moment with a warm mug, we built this cozy corner for you. We’re so glad to have you as part of our story.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AboutPage;

