import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LocationPage = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', color: 'text.primary', overflowX: 'hidden' }}>
      <Navbar />

      <Box sx={{ pt: { xs: 20, md: 28 }, pb: 15, position: 'relative' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 900, letterSpacing: 4, display: 'block', mb: 2 }}>LOCATION</Typography>
              <Typography variant="h2" sx={{ mb: 4, fontSize: { xs: '40px', md: '64px' } }}>Join Us for a Coffee</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '20px', maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
                Visit our cafe in Nueva Vizcaya and experience great coffee and good times.
              </Typography>
            </MotionBox>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{
              color: 'primary.main',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: 3,
              textTransform: 'uppercase',
              display: 'block',
              mb: 1
            }}>
              Located At
            </Typography>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: 0.5,
              fontSize: { xs: '24px', md: '35px' }
            }}>
              Boyie Street, Buag, Bambang, Nueva Vizcaya
            </Typography>
          </Box>

          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Box sx={{
              width: '100%',
              height: { xs: '500px', md: '750px' },
              borderRadius: 0,
              overflow: 'hidden',
              boxShadow: '0 60px 150px rgba(0,0,0,0.8)',
              border: '2px solid rgba(211, 47, 47, 0.2)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 0 150px rgba(0,0,0,0.6)',
                pointerEvents: 'none'
              },
              '& iframe': { filter: 'grayscale(0.6) invert(0.93) hue-rotate(180deg)' }
            }}>
              <iframe
                title="Mug Shot Cafe Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3827.7545065655245!2d121.1057059!3d16.3864634!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33905b9b2b43ac6b%3A0x22f8ca7d9cd3577a!2sMugshot%20Cafe!5e0!3m2!1sen!2sph!4v1778954484938!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </Box>
          </MotionBox>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default LocationPage;
