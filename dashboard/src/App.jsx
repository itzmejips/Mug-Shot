import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="menu" element={<MenuManager />} />
            <Route path="users" element={<UserManager />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

