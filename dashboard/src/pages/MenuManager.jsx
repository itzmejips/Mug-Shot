import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl, Stack, InputAdornment, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { Delete, Edit, Add, Search, CloudUpload, LocalCafe, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', photo: null });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = ['Rice Meals', 'Pasta and Appetizers', 'Waffle and Sweets', 'Signature Coffee', 'Coffee Lattes', 'Specialty Refreshments'];

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      navigate('/login');
    } else {
      fetchItems();
    }
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/menu`);
      setItems(data);
    } catch (error) {
      console.error('Error fetching menu', error);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setFormData({ name: item.name, description: item.description, price: item.price, category: item.category, photo: null });
      setEditingId(item._id);
    } else {
      setFormData({ name: '', description: '', price: '', category: '', photo: null });
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
    setFormData({ ...formData, photo: e.target.files[0] });
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

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/menu/${editingId}`, data, config);
      } else {
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
        await axios.delete(`${API_URL}/api/menu/${id}`);
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

      {/* Search Bar */}
      <Box sx={{ mb: 6 }}>
        <TextField
          fullWidth
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
              fontSize: '1.1rem'
            }
          }}
        />
      </Box>

      {/* flat Simplified Table Container */}
      <TableContainer component={Box} sx={{ bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden', mb: 6 }}>
        <Table>
          <TableBody>
            {/* Headers row */}
            <TableRow>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "1.1rem", fontWeight: 700, pb: 2, pl: 0 }}>Image</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "1.1rem", fontWeight: 700, pb: 2 }}>Name</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "1.1rem", fontWeight: 700, pb: 2 }}>Description</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "1.1rem", fontWeight: 700, pb: 2 }}>Price</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "1.1rem", fontWeight: 700, pb: 2 }}>Category</TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}></TableCell>
            </TableRow>
            
            {/* Data rows */}
            {filteredItems.map((item, index) => (
              <TableRow key={item._id || index}>
                <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, pl: 0 }}>
                  {item.photoUrl ? (
                    <Box 
                      component="img" 
                      src={`${API_URL}${item.photoUrl}`} 
                      sx={{ width: 56, height: 56, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(211, 47, 47, 0.12)' }} 
                    />
                  ) : (
                    <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(211, 47, 47, 0.12)' }}>
                      <LocalCafe sx={{ fontSize: 24, color: 'primary.main', opacity: 0.4 }} />
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, fontSize: "1rem", fontWeight: 600 }}>
                  {item.name}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, fontSize: "0.95rem", maxWidth: '300px' }}>
                  {item.description ? item.description.charAt(0).toUpperCase() + item.description.slice(1) : 'Experience the richness of our handcrafted selection, prepared fresh daily.'}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, fontSize: "1rem", fontWeight: 700 }}>
                  ₱{item.price}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 2.5, fontSize: "1rem" }}>
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

      {/* Button to Create Menu Item */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />} 
          onClick={() => handleOpen()}
          sx={{ py: 1.8, px: 5, borderRadius: 3, fontSize: '1rem', fontWeight: 800 }}
        >
          Add New Item
        </Button>
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: 4, 
            p: 1, 
            backgroundImage: 'none', 
            bgcolor: 'background.paper',
            border: '1px solid rgba(211, 47, 47, 0.12)'
          } 
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>{editingId ? 'Edit Item' : 'New Creation'}</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3.5} sx={{ mt: 2 }}>
            <TextField fullWidth label="Product Name" name="name" value={formData.name} onChange={handleChange} required variant="outlined" placeholder="e.g. Caramel Macchiato" />
            <TextField fullWidth label="Detailed Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} placeholder="Describe the flavors, ingredients, and story behind this item..." />
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Price (PHP)" 
                  name="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                  InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: 'primary.main', fontWeight: 700 }}>₱</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select name="category" value={formData.category} onChange={handleChange} required label="Category">
                        {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: 'text.primary' }}>Visual Presentation</Typography>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUpload />}
                  sx={{ 
                    py: 3, 
                    borderStyle: 'dashed', 
                    borderRadius: 4, 
                    borderColor: 'rgba(211, 47, 47, 0.3)',
                    color: 'text.secondary',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(211, 47, 47, 0.05)' }
                  }}
                >
                  {formData.photo ? formData.photo.name : 'Select High-Res Image'}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button onClick={handleClose} variant="text" sx={{ fontWeight: 700, color: 'text.secondary', px: 3 }}>Discard</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ px: 5, py: 1.5, borderRadius: 3, fontWeight: 800 }}>
            {editingId ? 'Save Changes' : 'Add to Menu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuManager;


