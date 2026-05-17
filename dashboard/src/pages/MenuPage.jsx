import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Stack, Button, Card, CardMedia, CardContent, Divider, Chip, CircularProgress } from '@mui/material';
import { LocalCafe, ArrowForward } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
const API_URL = rawApiUrl.replace(/\/$/, "");

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/api/menu`);
        const transformedItems = data.map(item => ({
          ...item,
          displayCategory: item.category
        }));
        setMenuItems(transformedItems);
        const uniqueCategories = [...new Set(transformedItems.map(item => item.displayCategory))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching menu', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.displayCategory === activeCategory);

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', color: 'text.primary', overflowX: 'hidden' }}>
      <Navbar />

      <Box sx={{ pt: { xs: 15, md: 20 }, pb: 15, bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="overline" sx={{ color: '#D32F2F', fontWeight: 900, letterSpacing: 4, display: 'block', mb: 2 }}>
              MENU
            </Typography>
            <Typography variant="h2" sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
              Explore Our Menu
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 3, mb: 8, px: 2 }}>
            <Button
              variant={activeCategory === 'All' ? 'contained' : 'outlined'}
              onClick={() => setActiveCategory('All')}
              sx={{ borderRadius: 10, px: 4, whiteSpace: 'nowrap', minWidth: 'fit-content' }}
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'contained' : 'outlined'}
                onClick={() => setActiveCategory(cat)}
                sx={{ borderRadius: 10, px: 4, whiteSpace: 'nowrap', minWidth: 'fit-content' }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color="primary" size={60} thickness={4} />
            </Box>
          ) : (
            <AnimatePresence mode="wait">
              <MotionBox
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                sx={{ width: '100%' }}
              >
                {filteredItems.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>Our menu is being updated. Stay tuned!</Typography>
                  </Box>
                ) : (
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)'
                    },
                    gap: 4,
                    width: '100%',
                    justifyItems: 'center',
                    alignItems: 'stretch'
                  }}>
                    {filteredItems.map((item) => (
                      <MotionCard
                        key={item._id}
                        variants={itemVariants}
                        sx={{
                          width: '100%',
                          maxWidth: '340px',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 0,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                          border: '1px solid rgba(211, 47, 47, 0.1)',
                          height: '100%'
                        }}
                      >
                        <Box sx={{ position: 'relative', overflow: 'hidden', width: '100%', aspectRatio: '1 / 1' }}>
                          {item.photoUrl ? (
                            <CardMedia
                              component="img"
                              image={`${API_URL}${item.photoUrl}`}
                              alt={item.name}
                              sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(211, 47, 47, 0.03)' }}>
                              <LocalCafe sx={{ fontSize: 60, color: '#D32F2F', opacity: 0.3 }} />
                            </Box>
                          )}
                        </Box>
                        <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3, minHeight: '2.6rem' }}>
                            {item.name}
                          </Typography>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.4rem' }}>
                              {item.description || "Experience the depth of flavor in every handcrafted sip."}
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 1, borderColor: 'rgba(211, 47, 47, 0.08)' }} />
                          <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', color: 'primary.main', fontWeight: 900, mt: 'auto', textAlign: 'center', letterSpacing: '-0.5px' }}>
                            ₱{item.price}
                          </Typography>
                        </CardContent>
                      </MotionCard>
                    ))}
                  </Box>
                )}
              </MotionBox>
            </AnimatePresence>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default MenuPage;
