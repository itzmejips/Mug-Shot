import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import MenuPage from './pages/MenuPage';
import LocationPage from './pages/LocationPage';
import SocialPage from './pages/SocialPage';
import AdminLogin from './pages/AdminLogin';
import MenuManager from './pages/MenuManager';
import UserManager from './pages/UserManager';
import AdminLayout from './components/AdminLayout';
import './App.css';

// Route guards for security
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("adminInfo");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("adminInfo");
  return isAuthenticated ? <Navigate to="/admin/menu" replace /> : children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/social" element={<SocialPage />} />
          
          {/* Authentication Route */}
          <Route path="/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
          
          {/* Secured Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/menu" replace />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="users" element={<UserManager />} />
          </Route>

          {/* Catch-all Route redirects to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

