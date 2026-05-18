import { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl, Stack, InputAdornment, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { Add, Search, CloudUpload, LocalCafe, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
const API_URL = rawApiUrl.replace(/\/$/, "");

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', photo: null, photoUrl: '', isPhotoRemoved: false });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = ['Rice Meals', 'Pasta and Appetizers', 'Waffle and Sweets', 'Signature Coffee', 'Coffee Lattes', 'Specialty Refreshments'];
  const fetchItems = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo')) || null;
      const headers = adminInfo && adminInfo.token ? { Authorization: `Bearer ${adminInfo.token}` } : {};
      const { data } = await axios.get(`${API_URL}/api/menu`, { headers });
      setItems(data);
    } catch (error) {
      console.error('Error fetching menu', error);
    }
  };

  useEffect(() => {
    const adminInfoRaw = localStorage.getItem('adminInfo');
    const adminInfo = adminInfoRaw ? JSON.parse(adminInfoRaw) : null;
    if (!adminInfo || !adminInfo.token) {
      // Ensure a fresh login so the token is available for protected actions
      navigate('/login');
      return;
    }
    void (async () => {
      try {
        const headers = { Authorization: `Bearer ${adminInfo.token}` };
        const { data } = await axios.get(`${API_URL}/api/menu`, { headers });
        setItems(data);
      } catch (error) {
        console.error('Error fetching menu', error);
      }
    })();
  }, [navigate]);

  const handleOpen = (item = null) => {
    if (item) {
      setFormData({ name: item.name, description: item.description, price: item.price, category: item.category, photo: null, photoUrl: item.photoUrl || '', isPhotoRemoved: false });
      setEditingId(item._id);
    } else {
      setFormData({ name: '', description: '', price: '', category: '', photo: null, photoUrl: '', isPhotoRemoved: false });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0], isPhotoRemoved: false });
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, photo: null, photoUrl: '', isPhotoRemoved: true });
  };

  const handleSubmit = async () => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }
    if (formData.isPhotoRemoved) {
      data.append('removePhoto', 'true');
    }

    try {
      if (editingId) {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo')) || null;
        if (adminInfo && adminInfo.token) config.headers = { ...config.headers, Authorization: `Bearer ${adminInfo.token}` };
        await axios.put(`${API_URL}/api/menu/${editingId}`, data, config);
      } else {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo')) || null;
        if (adminInfo && adminInfo.token) config.headers = { ...config.headers, Authorization: `Bearer ${adminInfo.token}` };
        await axios.post(`${API_URL}/api/menu`, data, config);
      }
      fetchItems();
      handleClose();
    } catch (error) {
      console.error('Error saving item', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");

    if (!confirmDelete) {
      alert("Delete Cancelled!");
      return;
    }

    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo')) || null;
      const headers = adminInfo && adminInfo.token ? { Authorization: `Bearer ${adminInfo.token}` } : {};
      await axios.delete(`${API_URL}/api/menu/${id}`, { headers });
      alert("Deleted successfully!");
      fetchItems();
    } catch (error) {
      console.error('Error deleting item', error);
      alert("Delete failed!");
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2 }}>
      {/* Centered Title */}
      <Typography variant="h2" align="center" sx={{ fontWeight: 900, color: 'text.primary', mb: 8, mt: 4, letterSpacing: '-1px' }}>
        Menu Collection
      </Typography>

      {/* Search Bar and Add Button */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 6 }}>
        <TextField
          placeholder="Search items by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'primary.main', ml: 1 }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 4,
              bgcolor: 'background.paper',
              border: '1px solid rgba(211, 84, 0, 0.1)',
              '& fieldset': { border: 'none' },
              height: '64px',
              fontSize: '18px'
            }
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{
            px: 4,
            borderRadius: 4,
            fontSize: '16px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            height: '64px'
          }}
        >
          Add New Item
        </Button>
      </Box>

      {/* flat Simplified Table Container */}
      <TableContainer component={Box} sx={{ bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden', mb: 6 }}>
        <Table>
          <TableBody>
            {/* Headers row */}
            <TableRow>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "18px", fontWeight: 700, pb: 2, pl: 0 }}>Image</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "18px", fontWeight: 700, pb: 2 }}>Name</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "18px", fontWeight: 700, pb: 2 }}>Description</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "18px", fontWeight: 700, pb: 2 }}>Price</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "18px", fontWeight: 700, pb: 2 }}>Category</TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}></TableCell>
            </TableRow>

            {/* Data rows */}
            {filteredItems.map((item, index) => (
              <TableRow key={item._id || index}>
                <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, pl: 0 }}>
                  {item.photoUrl ? (
                    <Box
                      component="img"
                      src={/^(https?:)?\/\//i.test(item.photoUrl) ? item.photoUrl : `${API_URL}${item.photoUrl}`}
                      sx={{ width: 56, height: 56, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(211, 47, 47, 0.12)' }}
                    />
                  ) : (
                    <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(211, 47, 47, 0.12)' }}>
                      <LocalCafe sx={{ fontSize: 24, color: 'primary.main', opacity: 0.4 }} />
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, fontSize: "16px", fontWeight: 600 }}>
                  {item.name}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, fontSize: "15px", maxWidth: '300px' }}>
                  {item.description ? item.description.charAt(0).toUpperCase() + item.description.slice(1) : 'Experience the richness of our handcrafted selection, prepared fresh daily.'}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, fontSize: "16px", fontWeight: 700 }}>
                  ₱{item.price}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, fontSize: "16px" }}>
                  {item.category}
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5 }} align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpen(item)}
                    sx={{
                      color: "#42a5f5",
                      borderColor: "#42a5f5",
                      fontWeight: 700,
                      px: 3,
                      borderRadius: 1.5,
                      textTransform: 'uppercase',
                      '&:hover': {
                        borderColor: "#42a5f5",
                        bgcolor: "transparent"
                      }
                    }}
                  >
                    EDIT
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      marginLeft: "10px",
                      color: "#ff5252",
                      borderColor: "#ff5252",
                      fontWeight: 700,
                      px: 3,
                      borderRadius: 1.5,
                      textTransform: 'uppercase',
                      '&:hover': {
                        borderColor: "#ff5252",
                        bgcolor: "transparent"
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>



      {/* Create/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3, // Exactly matching the 12px rounding of the login card container
              p: 1,
              backgroundImage: 'none',
              bgcolor: 'background.paper',
              border: '1px solid rgba(211, 47, 47, 0.12)'
            }
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            {editingId ? 'Edit Item' : 'Add Item'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3.5} sx={{ mt: 2 }}>
            <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required variant="outlined" />
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={2} />
            <TextField
              fullWidth
              label="Price (PHP)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              slotProps={{
                htmlInput: { min: 0 },
                input: {
                  startAdornment: <InputAdornment position="start" sx={{ color: 'primary.main', fontWeight: 700 }}>₱</InputAdornment>
                }
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={formData.category} onChange={handleChange} required label="Category">
                {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'text.secondary' }}>Image</Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUpload />}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: 'rgba(211, 47, 47, 0.3)',
                    color: 'text.secondary',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(211, 47, 47, 0.05)' }
                  }}
                >
                  {formData.photo ? formData.photo.name : (formData.photoUrl ? 'Change Image' : 'Select Image')}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  disabled={!formData.photo && !formData.photoUrl}
                  onClick={handleRemovePhoto}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 'bold',
                    py: 1.5,
                    textTransform: 'uppercase'
                  }}
                >
                  Remove Image
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button onClick={handleClose} variant="text" sx={{ fontWeight: 700, color: 'text.secondary', px: 3 }}>Discard</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ px: 5, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}>
            {editingId ? 'Save Changes' : 'Add to Menu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuManager;


