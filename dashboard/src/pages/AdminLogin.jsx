import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D32F2F', // Deep Crimson
      light: '#E57373',
      dark: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F5F5DC',
    },
    background: {
      default: '#120F0D', // Rich Espresso Black
      paper: '#1C1816', // Roasted Bean
    },
    text: {
      primary: '#FDF5E6', // Old Lace / Warm Cream
      secondary: '#A09088', // Warm Mocha Gray
    },
  },
  shape: {
    borderRadius: 4, // Standard MUI rounding (so borderRadius: 3 is 12px, which is a subtle modern round)
  }
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!username || !password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "The username or password you entered is incorrect.");
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "100vw",
          bgcolor: "background.default",
        }}
      >
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 4,
              boxShadow: 5,
              borderRadius: 3, // With shape.borderRadius=4, this is exactly 12px subtle rounding!
              bgcolor: "background.paper",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />

              {error && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: "bold" }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Link href="#" variant="body2" sx={{ textDecoration: "none" }}>
                  Forgot Password?
                </Link>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              sx={{
                textDecoration: "none",
                fontWeight: 600,
                color: 'text.secondary',
                opacity: 0.7,
                '&:hover': { opacity: 1, color: 'primary.main' },
                transition: '0.2s'
              }}
            >
              ← Back to Landing Page
            </Link>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AdminLogin;
