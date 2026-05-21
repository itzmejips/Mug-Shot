import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardMedia, CardContent, Divider, CircularProgress } from '@mui/material';
import { LocalCafe } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './MenuPage.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1337';
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
    <Box className="menu-page-container">
      <Navbar />

      <Box className="menu-hero">
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box className="menu-header">
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="overline" className="menu-overline">
                MENU
              </Typography>
              <Typography variant="h2" className="menu-title">
                Explore Our Menu
              </Typography>
            </MotionBox>
          </Box>

          <Box className="category-bar">
            <Button
              variant={activeCategory === 'All' ? 'contained' : 'outlined'}
              onClick={() => setActiveCategory('All')}
              className="category-button"
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'contained' : 'outlined'}
                onClick={() => setActiveCategory(cat)}
                className="category-button"
              >
                {cat}
              </Button>
            ))}
          </Box>

          {loading ? (
            <Box className="loading-box">
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
                  <Box className="empty-menu-box">
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>Our menu is being updated. Stay tuned!</Typography>
                  </Box>
                ) : (
                  <Box className="menu-grid">
                    {filteredItems.map((item) => (
                      <MotionCard
                        key={item._id}
                        variants={itemVariants}
                        className="menu-card"
                      >
                        <Box className="photo-wrapper">
                          {item.photoUrl ? (
                            <CardMedia
                              component="img"
                              image={/^(https?:)?\/\//i.test(item.photoUrl) ? item.photoUrl : `${API_URL}${item.photoUrl}`}
                              alt={item.name}
                              className="photo-media"
                            />
                          ) : (
                            <Box className="no-photo-box">
                              <LocalCafe sx={{ fontSize: 60, color: '#D32F2F', opacity: 0.3 }} />
                            </Box>
                          )}
                        </Box>
                        <CardContent className="menu-card-content">
                          <Typography variant="h6" className="item-name">
                            {item.name}
                          </Typography>
                          <Box className="item-desc-box">
                            <Typography variant="body2" className="item-desc">
                              {item.description || "Experience the depth of flavor in every handcrafted sip."}
                            </Typography>
                          </Box>
                          <Divider className="item-divider" />
                          <Typography variant="h5" className="item-price">
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

