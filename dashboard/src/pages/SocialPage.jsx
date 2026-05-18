import React from 'react';
import { Box, Container, Grid, Typography, Stack, Card, Button } from '@mui/material';
import { Facebook } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const SocialPage = () => {
  const socialPlatforms = [
    {
      name: 'Facebook',
      handle: '@MugShotCafe',
      icon: <Facebook sx={{ fontSize: 40 }} />,
      description: 'Official Facebook Page.',
      link: 'https://www.facebook.com/profile.php?id=61555738840293'
    }
  ];

  return (
    <Box sx={{
      backgroundColor: 'background.default',
      minHeight: '100vh',
      color: 'text.primary'
    }}>
      <Navbar />

      <Box sx={{ pt: 25, pb: 20 }}>
        <Container maxWidth="xl">
          {/* Canonical Header Design */}
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="overline" sx={{ color: '#D32F2F', fontWeight: 900, letterSpacing: 4, display: 'block' }}>
                SOCIAL
              </Typography>
              <Typography variant="h2" sx={{ mb: 4, mt: 2, fontSize: { xs: '40px', md: '64px' } }}>
                Social Gallery
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
                Bringing stories into life with every sip
              </Typography>
            </MotionBox>
          </Box>

          {/* Premium Platform Card - Original Branding */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 20 }}>
            {socialPlatforms.map((platform) => (
              <MotionBox
                key={platform.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                sx={{ width: '100%', maxWidth: '900px' }}
              >
                <Card sx={{
                  p: { xs: 3, md: 4 },
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  gap: { xs: 3, md: 5 },
                  bgcolor: 'rgba(28, 24, 22, 0.6)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: 2,
                  border: '1px solid rgba(211, 47, 47, 0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    minWidth: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #1877F2',
                    color: '#1877F2',
                    bgcolor: 'rgba(24, 119, 242, 0.05)',
                    borderRadius: '50%'
                  }}>
                    {platform.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ mb: 0.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>{platform.name}</Typography>
                      <Typography variant="h6" sx={{ color: '#D32F2F', fontWeight: 600, opacity: 0.9, lineHeight: 1, transform: 'translateY(-1px)' }}>{platform.handle}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0, opacity: 0.8 }}>{platform.description}</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    href={platform.link}
                    target="_blank"
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      bgcolor: '#1877F2',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 900,
                      whiteSpace: 'nowrap',
                      minWidth: 'fit-content',
                      boxShadow: '0 10px 20px rgba(24, 119, 242, 0.2)',
                      '&:hover': { bgcolor: 'white', color: '#1877F2' }
                    }}
                  >
                    FOLLOW PAGE
                  </Button>
                </Card>
              </MotionBox>
            ))}
          </Box>

          {/* Architectural Art Gallery - Native Sizing */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>Latest Moments</Typography>
            <Box sx={{ width: '80px', height: '4px', bgcolor: '#D32F2F', mx: 'auto', mb: 10 }} />

            <Stack spacing={12} sx={{ alignItems: 'center' }}>
              {[
                {
                  src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0pQG1oJqLv85PFNYWWkmTUehC4jHx93RLgd1vtfmRw5us9HLNhSjauaJyZr1Ym3pil%26id%3D61555738840293&show_text=false&width=500",
                  height: 419,
                  width: '500px'
                },
                {
                  src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid036SWXdB8MVrCnN4EaSY6JMM8boX4JxL9v3wtFM6FkAaeJwbyBx3y6VPZCH6k6knZ1l%26id%3D61555738840293&show_text=false&width=500",
                  height: 515,
                  width: '500px'
                },
                {
                  src: "https://www.facebook.com/plugins/video.php?height=701&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2820434941794826%2F&show_text=false&width=500&t=0",
                  height: 700,
                  width: '500px'
                }
              ].map((post, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  sx={{ width: '100%', maxWidth: post.width }}
                >
                  <Box sx={{
                    p: { xs: 0.5, md: 1 },
                    bgcolor: '#1C1816',
                    border: '2px solid rgba(211, 47, 47, 0.4)',
                    boxShadow: '0 50px 100px rgba(0,0,0,0.7)',
                    position: 'relative',
                    width: '100%',
                    height: post.height,
                    overflow: 'hidden',
                    transition: '0.4s',
                    '&:hover': {
                      borderColor: '#D32F2F',
                      transform: 'scale(1.02)',
                    }
                  }}>
                    <iframe
                      src={post.src}
                      width="100%"
                      height={post.height}
                      style={{ border: 'none', overflow: 'hidden', display: 'block' }}
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    />
                  </Box>
                </MotionBox>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default SocialPage;
