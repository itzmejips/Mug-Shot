import React from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton, AppBar, Toolbar, Avatar, Button } from '@mui/material';
import { RestaurantMenu, People, ExitToApp, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const drawerWidth = 260;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Menu Management', icon: <RestaurantMenu />, path: '/admin/menu' },
    { text: 'User Management', icon: <People />, path: '/admin/users' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(211, 47, 47, 0.1)' }}>
      {/* Brand Header - Simple & Clean */}
      <Box sx={{ p: 4, mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-1px' }}>
          Mug Shot
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5, mb: 3 }} />

      {/* Menu Navigation */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton 
              key={item.text} 
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{
                borderRadius: 2,
                mb: 1.5,
                py: 1.5,
                backgroundColor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor: isActive ? 'primary.main' : 'rgba(211, 47, 47, 0.08)',
                  color: isActive ? 'white' : 'primary.main',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '15px' } } }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Logout Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(211, 47, 47, 0.1)' }}>
        <Button 
          fullWidth
          variant="outlined"
          color="error" 
          startIcon={<ExitToApp />}
          onClick={handleLogout}
          sx={{
            py: 1.2,
            borderRadius: 2,
            fontWeight: 700,
            '&:hover': {
              backgroundColor: 'rgba(255, 82, 82, 0.08)',
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { sm: 'none' },
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(211, 47, 47, 0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 800 }}>
            Mug Shot Admin
          </Typography>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '13px' }}>
            {adminInfo.name?.charAt(0).toUpperCase() || adminInfo.email?.charAt(0).toUpperCase() || 'A'}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Drawer Container */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 3, md: 5 }, 
          width: { sm: `calc(100% - ${drawerWidth}px)` }, 
          pt: { xs: 10, sm: 5 },
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;


