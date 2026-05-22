import { useState } from "react";
import {
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  CssBaseline,
  Alert,
  Avatar,
  Paper,
  InputAdornment,
  IconButton
} from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import { Email, Lock, Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import theme from '../theme';
import logoImg from '../assets/logo.jpg';
import bgImg from '../assets/MugShot.jpeg';

const MotionPaper = motion(Paper);

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1337';
const API_URL = rawApiUrl.replace(/\/$/, "");

function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "The email or password you entered is incorrect.");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminInfo", JSON.stringify(data));
      window.location.href = "/admin/menu";
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        "Unable to reach the server. Please check if your backend is running.",
      );
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "100vw",
          position: "relative",
          backgroundImage: `linear-gradient(135deg, rgba(18, 15, 13, 0.88) 0%, rgba(28, 24, 22, 0.95) 100%), url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
          px: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(211, 47, 47, 0.15) 0%, transparent 70%)",
            top: "10%",
            left: "15%",
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(211, 47, 47, 0.1) 0%, transparent 75%)",
            bottom: "10%",
            right: "10%",
            zIndex: 0,
          }
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
          <MotionPaper
            elevation={0}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: { xs: 4, sm: 5 },
              borderRadius: "24px",
              bgcolor: "rgba(28, 24, 22, 0.65)",
              backdropFilter: "blur(20px) saturate(120%)",
              WebkitBackdropFilter: "blur(20px) saturate(120%)",
              border: "1px solid rgba(211, 47, 47, 0.15)",
              boxShadow: "0 24px 64px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Logo Avatar */}
            <Avatar
              src={logoImg}
              alt="Mug Shot Logo"
              sx={{
                width: 90,
                height: 90,
                mb: 2.5,
                border: "2px solid #D32F2F",
                boxShadow: "0 8px 24px rgba(211, 47, 47, 0.3)",
                bgcolor: "#1C1816"
              }}
            />

            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 900,
                color: "#FDF5E6",
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontFamily: '"Gotham", "Avenir Next", "Segoe UI", sans-serif',
                textAlign: "center"
              }}
            >
              Mug Shot
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                letterSpacing: "2px",
                mb: 4,
                textTransform: "uppercase"
              }}
            >
              Admin Portal
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "rgba(18, 15, 13, 0.4)",
                    transition: "all 0.3s",
                    "& fieldset": {
                      borderColor: "rgba(211, 47, 47, 0.15)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(211, 47, 47, 0.35)",
                    },
                    "&.Mui-focused": {
                      bgcolor: "rgba(18, 15, 13, 0.6)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D32F2F",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "text.secondary",
                    "&.Mui-focused": {
                      color: "primary.main",
                    }
                  }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "rgba(18, 15, 13, 0.4)",
                    transition: "all 0.3s",
                    "& fieldset": {
                      borderColor: "rgba(211, 47, 47, 0.15)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(211, 47, 47, 0.35)",
                    },
                    "&.Mui-focused": {
                      bgcolor: "rgba(18, 15, 13, 0.6)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D32F2F",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "text.secondary",
                    "&.Mui-focused": {
                      color: "primary.main",
                    }
                  }
                }}
              />

              {error && (
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{
                    mt: 1,
                    mb: 2,
                    width: '100%',
                    borderRadius: "12px",
                    bgcolor: "error.dark",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                  }}
                >
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  mb: 2,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  letterSpacing: "1px",
                  bgcolor: "primary.main",
                  color: "#120F0D",
                  boxShadow: "0 8px 20px rgba(211, 47, 47, 0.35)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: "#FFFFFF",
                    color: "primary.main",
                    boxShadow: "0 12px 24px rgba(255, 255, 255, 0.35)",
                  }
                }}
              >
                {loading ? "Logging In..." : "Login"}
              </Button>
            </Box>
          </MotionPaper>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              sx={{
                textDecoration: "none",
                fontWeight: 700,
                color: 'text.secondary',
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                opacity: 0.75,
                '&:hover': {
                  opacity: 1,
                  color: 'primary.main',
                  transform: "translateX(-2px)"
                },
                transition: 'all 0.3s'
              }}
            >
              <ArrowBack sx={{ fontSize: 16 }} /> Back to Landing Page
            </Link>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AdminLogin;