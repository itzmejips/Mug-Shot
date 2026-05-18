import { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, Stack, IconButton } from '@mui/material';
import { ArrowForward, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

// Local Asset Imports
import mugshotImg from '../assets/MugShot.jpeg';
import menuImg from '../assets/Menu.jpeg';
import aboutus from '../assets/AboutUs.png';
import visitus from '../assets/about.jpeg';

const MotionBox = motion(Box);

const carouselSlides = [
  {
    title: "Mug Shot",
    subtitle: "Bringing stories into life with every sip",
    image: mugshotImg,
    cta: "Explore Cafe",
    link: "/menu"
  },
  {
    title: "The Menu",
    subtitle: "Created with love and tenderness.",
    image: menuImg,
    cta: "Discover Our Menu",
    link: "/menu"
  },
  {
    title: "Our Story",
    subtitle: "A home for the soul, a brew for the heart.",
    image: aboutus,
    cta: "Learn Our Story",
    link: "/about"
  },
  {
    title: "Visit Us",
    subtitle: "Your cozy corner in the heart of Nueva Vizcaya.",
    image: visitus,
    cta: "Find Our Location",
    link: "/location"
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isIdle, setIsIdle] = useState(true);

  // Autoplay only when user is idle
  useEffect(() => {
    if (!isIdle) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 10000); // Change slide every 10 seconds
    return () => clearInterval(timer);
  }, [isIdle]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

  return (
    <Box className="home-container">
      <Navbar />

      {/* Premium Hero Carousel */}
      <Box
        className="carousel-viewport"
        onMouseEnter={() => setIsIdle(false)}
        onMouseLeave={() => setIsIdle(true)}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="slide-wrapper"
          >
            <Box
              className="slide-background"
              style={{ backgroundImage: `url(${carouselSlides[currentSlide].image})` }}
            />
          </MotionBox>
        </AnimatePresence>

        <Container maxWidth="xl" sx={{ height: '100%', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box className="hero-content-box">
            <AnimatePresence mode="wait">
              <MotionBox
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="hero-slide-content"
              >
                <Typography variant="h1" className="hero-title">
                  {carouselSlides[currentSlide].title.split(' ').map((word, i) => (
                    <span key={i}>
                      {i === 1 ? (
                        <Box component="span" className="hero-title-highlight">{word}</Box>
                      ) : (
                        word + ' '
                      )}
                    </span>
                  ))}
                </Typography>
                <Typography variant="h6" className="hero-subtitle">
                  {carouselSlides[currentSlide].subtitle}
                </Typography>
                <Stack direction="row" spacing={3} justifyContent="center">
                  {carouselSlides[currentSlide].title !== 'Mug Shot' && carouselSlides[currentSlide].cta && (
                    <Button
                      component={RouterLink}
                      to={carouselSlides[currentSlide].link}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      className="hero-button"
                    >
                      {carouselSlides[currentSlide].cta}
                    </Button>
                  )}
                </Stack>
              </MotionBox>
            </AnimatePresence>
          </Box>
        </Container>

        {/* Carousel Navigation */}
        <Box className="carousel-nav">
          <IconButton
            onClick={prevSlide}
            className="carousel-nav-btn"
          >
            <ChevronLeft fontSize="large" />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            className="carousel-nav-btn"
          >
            <ChevronRight fontSize="large" />
          </IconButton>
        </Box>

        {/* Slide Indicators */}
        <Box className="slide-indicators">
          {carouselSlides.map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="slide-indicator-dot"
              style={{
                width: i === currentSlide ? 40 : 12,
                backgroundColor: i === currentSlide ? '#D32F2F' : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;




