import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, Stack, Grid, Card, Chip, IconButton } from '@mui/material';
import { LocalCafe, ArrowForward, Star, Favorite, Instagram, Facebook, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Local Asset Imports
import mugshotImg from '../assets/MugShot.jpeg';
import menuImg from '../assets/Menu.jpg';

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
    subtitle: "Crafted with precision and love.",
    image: menuImg,
    cta: "Discover Our Menu",
    link: "/menu"
  },
  {
    title: "Our Roots",
    subtitle: "Born and brewed in Nueva Vizcaya.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop",
    cta: "Learn Our Story",
    link: "/about"
  },
  {
    title: "Visit Us",
    subtitle: "Experience the magic in person.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop",
    cta: "Find Our Location",
    link: "/location"
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', color: 'text.primary', overflowX: 'hidden' }}>
      <Navbar />

      {/* Premium Hero Carousel */}
      <Box sx={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
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
                filter: 'brightness(50%)',
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
                  fontSize: { xs: '3.5rem', md: '5.5rem', lg: '7.5rem' }, 
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
                  fontSize: '1.25rem', 
                  fontWeight: 400,
                  textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                }}>
                  {carouselSlides[currentSlide].subtitle}
                </Typography>
                <Stack direction="row" spacing={3} justifyContent="center">
                  <Button component={RouterLink} to={carouselSlides[currentSlide].link} variant="contained" color="primary" size="large" endIcon={<ArrowForward />} sx={{ py: 2.5, px: 6, fontSize: '1.1rem', borderRadius: 4 }}>
                    {carouselSlides[currentSlide].cta}
                  </Button>
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



