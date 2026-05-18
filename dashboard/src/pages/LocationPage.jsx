import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import './LocationPage.css';

const MotionBox = motion(Box);

const LocationPage = () => {
  return (
    <Box className="location-page-container">
      <Navbar />

      <Box className="location-hero">
        <Container maxWidth="lg">
          <Box className="location-header">
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="overline" className="location-overline">LOCATION</Typography>
              <Typography variant="h2" className="location-title">Join Us for a Coffee</Typography>
              <Typography variant="h6" className="location-subtitle">
                Visit our cafe in Nueva Vizcaya and experience great coffee and good times.
              </Typography>
            </MotionBox>
          </Box>

          <Box className="address-block">
            <Typography variant="overline" className="address-overline">
              Located At
            </Typography>
            <Typography variant="h4" className="address-details">
              Boyie Street, Buag, Bambang, Nueva Vizcaya
            </Typography>
          </Box>

          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Box className="map-wrapper">
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

