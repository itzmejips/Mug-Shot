import { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, Stack, IconButton } from '@mui/material';
import { ArrowForward, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    image: mugshotImg
    ,
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

  // Autoplay pauses while hovering over the carousel (hover-only)

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', color: 'text.primary', overflowX: 'hidden' }}>
      <Navbar />

      {/* Premium Hero Carousel */}
      <Box
        sx={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}
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
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${carouselSlides[currentSlide].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(65%)', // Darken the image for better text contrast
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(rgba(12,9,8,0.35), rgba(12,9,8,0.65)), linear-gradient(to top, rgba(12,9,8,0.9) 0%, transparent 30%)',
                }
              }}
            />
          </MotionBox>
        </AnimatePresence>

        <Container maxWidth="xl" sx={{ height: '100%', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ maxWidth: '800px', pt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <AnimatePresence mode="wait">
              <MotionBox
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Typography variant="h1" sx={{
                  fontSize: { xs: '56px', md: '88px', lg: '120px' },
                  mb: 3,
                  lineHeight: 1.1,
                  fontWeight: 900,
                  textShadow: '0 4px 20px rgba(0,0,0,0.6)'
                }}>
                  {carouselSlides[currentSlide].title.split(' ').map((word, i) => (
                    <span key={i}>
                      {i === 1 ? (
                        <Box component="span" sx={{ color: 'primary.main' }}>{word}</Box>
                      ) : (
                        word + ' '
                      )}
                    </span>
                  ))}
                </Typography>
                <Typography variant="h6" sx={{
                  color: 'rgba(255,255,255,0.85)',
                  mb: 6,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: '20px',
                  fontWeight: 400,
                  textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                }}>
                  {carouselSlides[currentSlide].subtitle}
                </Typography>
                <Stack direction="row" spacing={3} justifyContent="center">
                  {carouselSlides[currentSlide].title !== 'Mug Shot' && carouselSlides[currentSlide].cta && (
                    <Button
                      component={RouterLink}
                      to={carouselSlides[currentSlide].link}
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{ py: 2.5, px: 6, fontSize: '18px', borderRadius: 4 }}
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
        <Box sx={{ position: 'absolute', bottom: 60, right: 80, zIndex: 2, display: 'flex', gap: 2 }}>
          <IconButton
            onClick={prevSlide}
            sx={{
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              p: 2,
              '&:hover': { bgcolor: 'primary.main', borderColor: 'primary.main' }
            }}
          >
            <ChevronLeft fontSize="large" />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            sx={{
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              p: 2,
              '&:hover': { bgcolor: 'primary.main', borderColor: 'primary.main' }
            }}
          >
            <ChevronRight fontSize="large" />
          </IconButton>
        </Box>

        {/* Slide Indicators */}
        <Box sx={{ position: 'absolute', bottom: 80, left: 80, zIndex: 2, display: 'flex', gap: 1.5 }}>
          {carouselSlides.map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrentSlide(i)}
              sx={{
                width: i === currentSlide ? 40 : 12,
                height: 4,
                bgcolor: i === currentSlide ? 'primary.main' : 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                transition: '0.6s',
                cursor: 'pointer'
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



