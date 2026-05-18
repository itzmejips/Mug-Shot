import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import aboutImg from '../assets/about.jpeg';
import './AboutPage.css';

const MotionBox = motion(Box);

const AboutPage = () => {
  return (
    <Box className="about-page-container">
      <Navbar />

      <Box className="about-hero">
        <Container maxWidth="md">
          <Box className="about-header">
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="overline" className="about-overline">OUR STORY</Typography>
              <Typography variant="h2" className="about-title">The Mug Shot Story</Typography>
            </MotionBox>
          </Box>

          <MotionBox
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="about-image-wrapper"
          >
            <Box
              component="img"
              src={aboutImg}
              alt="Mug Shot Cafe"
              className="about-image"
            />
          </MotionBox>

          <Box className="about-content">
            <Typography variant="body1" className="about-paragraph about-paragraph-spacing">
              It all started with a simple belief that a good cup of coffee can make any day a little brighter. Mug Shot wasn't born out of a big business plan. It grew from a simple dream to build a warm, cozy spot right here in Nueva Vizcaya where people could just sit, slow down, and feel at home.
            </Typography>
            <Typography variant="body1" className="about-paragraph about-paragraph-spacing">
              On July 11, 2025, we finally opened our doors on Boyie Street in Bambang. We didn't have much at first, it was just a small space, a passion for roasting, and a deep respect for our local farmers. We wanted every cup we served to not only taste great, but to also honor the hard work of the hands that grew it.
            </Typography>
            <Typography variant="body1" className="about-paragraph">
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


