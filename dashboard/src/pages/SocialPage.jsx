import { Box, Container, Typography, Stack, Card, Button } from '@mui/material';
import { Facebook, Phone, Mail } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import './SocialPage.css';

const MotionBox = motion(Box);

const SocialPage = () => {
  const socialPlatforms = [
    {
      name: 'Facebook',
      handle: '@MugShotCafe',
      icon: <Facebook sx={{ fontSize: 40 }} />,
      description: 'Official Facebook Page. Follow us for updates, daily specials, and community stories.',
      link: 'https://www.facebook.com/profile.php?id=61555738840293',
      buttonText: 'FOLLOW PAGE',
      color: '#1877F2',
      bgLight: 'rgba(24, 119, 242, 0.08)',
      shadow: 'rgba(24, 119, 242, 0.25)'
    },
    {
      name: 'Phone',
      handle: '0976 469 2606',
      icon: <Phone sx={{ fontSize: 40 }} />,
      description: 'Call or message us directly. Available for inquiries, delivery reservations, and booking events.',
      link: 'tel:09764692606',
      buttonText: 'CALL NOW',
      color: '#2E7D32',
      bgLight: 'rgba(46, 125, 50, 0.08)',
      shadow: 'rgba(46, 125, 50, 0.25)'
    },
    {
      name: 'Email',
      handle: 'bryll.business@gmail.com',
      icon: <Mail sx={{ fontSize: 40 }} />,
      description: 'Reach out to us via email. Send us a message for business proposals, feedback, and partnerships.',
      link: 'mailto:bryll.business@gmail.com',
      buttonText: 'SEND EMAIL',
      color: '#D32F2F',
      bgLight: 'rgba(211, 47, 47, 0.08)',
      shadow: 'rgba(211, 47, 47, 0.25)'
    }
  ];

  return (
    <Box className="social-page-container">
      <Navbar />

      <Box className="social-page-hero">
        <Container maxWidth="xl">
          {/* Canonical Header Design */}
          <Box className="social-header">
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="overline" className="social-overline">
                SOCIAL
              </Typography>
              <Typography variant="h2" className="social-title">
                Social Gallery
              </Typography>
              <Typography variant="h6" className="social-subtitle">
                Bringing stories into life with every sip
              </Typography>
            </MotionBox>
          </Box>

          {/* Premium Platform Cards */}
          <Box className="card-wrapper">
            {socialPlatforms.map((platform) => (
              <MotionBox
                key={platform.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                sx={{ width: '100%', maxWidth: '900px' }}
                style={{
                  '--platform-color': platform.color,
                  '--platform-bg-light': platform.bgLight,
                  '--platform-shadow': platform.shadow,
                }}
              >
                <Card className="platform-card">
                  <Box className="platform-avatar">
                    {platform.icon}
                  </Box>
                  <Box className="platform-info">
                    <Box className="platform-info-stack">
                      <Typography variant="h4" className="platform-name">{platform.name}</Typography>
                      <Typography variant="h6" className="platform-handle">{platform.handle}</Typography>
                    </Box>
                    <Typography variant="body2" className="platform-description">{platform.description}</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    href={platform.link}
                    target={platform.link.startsWith('http') ? '_blank' : undefined}
                    className="follow-button"
                  >
                    {platform.buttonText}
                  </Button>
                </Card>
              </MotionBox>
            ))}
          </Box>

          {/* Architectural Art Gallery - Native Sizing */}
          <Box className="gallery-container">
            <Typography variant="h2" className="gallery-title">Latest Moments</Typography>
            <Box className="gallery-divider" />

            <Stack className="post-stack">
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
                  <Box className="post-frame" sx={{ height: post.height }}>
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
