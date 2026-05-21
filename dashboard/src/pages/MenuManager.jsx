import { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl, Stack, InputAdornment, Table, TableBody, TableCell, TableContainer, TableRow, Avatar, Snackbar, Alert } from '@mui/material';
import { Add, Search, CloudUpload, LocalCafe, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1337';
const API_URL = rawApiUrl.replace(/\/$/, "");

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', photo: null, photoUrl: '', isPhotoRemoved: false });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, itemId: null });
  const showMessage = (msg, sev = 'success') => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };
  const navigate = useNavigate();

  const categories = ['Rice Meals', 'Pasta and Appetizers', 'Waffle and Sweets', 'Signature Coffee', 'Coffee Lattes', 'Specialty Refreshments'];
  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/menu`);
      setItems(data);
    } catch (error) {
      console.error('Error fetching menu', error);
    }
  };

  useEffect(() => {
    const adminInfoRaw = localStorage.getItem('adminInfo');
    const adminInfo = adminInfoRaw ? JSON.parse(adminInfoRaw) : null;
    if (!adminInfo) {
      navigate('/login');
      return;
    }
    void (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/menu`);
        setItems(data);
      } catch (error) {
        console.error('Error fetching menu', error);
      }
    })();
  }, [navigate]);

  const handleOpen = (item = null) => {
    setError('');
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
    setError('');
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      setFormData({ ...formData, price: '' });
      return;
    }
    // strip any minus signs to prevent negative values
    let sanitized = raw.replace(/-/g, '');
    
    // Clamp the value strictly to between 0 and 9999
    const parsed = parseFloat(sanitized);
    if (!isNaN(parsed)) {
      if (parsed > 9999) {
        sanitized = '9999';
      } else if (parsed < 0) {
        sanitized = '0';
      }
    }
    setFormData({ ...formData, price: sanitized });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Only image files are allowed.");
        e.target.value = null; // Clear the input
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be under 5MB.");
        e.target.value = null; // Clear the input
        return;
      }
      setError('');

      // revoke previous object URL if it was created for a file
      if (formData.photo && formData.photoUrl) {
        try { URL.revokeObjectURL(formData.photoUrl); } catch (err) { /* ignore */ }
      }
      const preview = URL.createObjectURL(file);
      setFormData({ ...formData, photo: file, photoUrl: preview, isPhotoRemoved: false });
    }
  };

  const handleRemovePhoto = () => {
    // revoke object URL if present
    if (formData.photo && formData.photoUrl) {
      try { URL.revokeObjectURL(formData.photoUrl); } catch (err) { /* ignore */ }
    }
    setFormData({ ...formData, photo: null, photoUrl: '', isPhotoRemoved: true });
  };

  const handleSubmit = async () => {
    setError('');
    const name = formData.name.trim();
    const description = formData.description.trim();
    const price = formData.price;
    const category = formData.category;

    if (!name) {
      setError("Item name is required.");
      return;
    }

    const priceNum = parseFloat(price);
    if (price === '' || isNaN(priceNum) || priceNum < 0 || priceNum > 9999) {
      setError("Price must be a number between ₱0 and ₱9999.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('price', price);
    data.append('category', category);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }
    if (formData.isPhotoRemoved) {
      data.append('removePhoto', 'true');
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/menu/${editingId}`, data, config);
        showMessage("Menu item updated successfully!", "success");
      } else {
        await axios.post(`${API_URL}/api/menu`, data, config);
        showMessage("Menu item added successfully!", "success");
      }
      fetchItems();
      handleClose();
    } catch (error) {
      console.error('Error saving item', error);
      const serverMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected error occurred';
      setError(`Error saving menu item: ${serverMessage}`);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, itemId: id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.itemId;
    setDeleteConfirm({ open: false, itemId: null });
    try {
      await axios.delete(`${API_URL}/api/menu/${id}`);
      showMessage("Deleted successfully!", "success");
      fetchItems();
    } catch (error) {
      console.error('Error deleting item', error);
      showMessage("Delete failed!", "error");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, itemId: null });
    showMessage("Delete Cancelled!", "info");
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
                        bgcolor: "transparent",
                        boxShadow: '0 4px 15px rgba(66, 165, 245, 0.3)',
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
                        bgcolor: "transparent",
                        boxShadow: '0 4px 15px rgba(255, 82, 82, 0.3)',
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(item._id);
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
          {error && (
            <Alert
              severity="error"
              variant="filled"
              sx={{
                mb: 3,
                mt: 1,
                borderRadius: "12px",
                bgcolor: "error.dark",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              {error}
            </Alert>
          )}
          <Stack spacing={3.5} sx={{ mt: 2 }}>
            <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required variant="outlined" />
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={2} />
            <TextField
              fullWidth
              label="Price (PHP)"
              name="price"
              type="number"
              inputProps={{ min: 0, max: 9999 }}
              value={formData.price}
              onChange={handlePriceChange}
              onKeyDown={(e) => {
                // Prevent entering minus, e (exponent) and plus signs
                if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault();
              }}
              required
              slotProps={{
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
              <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'center', width: '100%' }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={
                    formData.photoUrl ? (
                      <Avatar src={formData.photoUrl} sx={{ width: 36, height: 36 }} />
                    ) : (
                      <CloudUpload />
                    )
                  }
                  sx={{
                    py: 1.25,
                    px: 3,
                    minWidth: 220,
                    borderRadius: 3,
                    borderColor: 'rgba(211, 47, 47, 0.3)',
                    color: 'text.secondary',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    display: 'flex',
                    justifyContent: 'center',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(211, 47, 47, 0.05)' }
                  }}
                >
                  {formData.photoUrl ? 'Change Image' : 'Select Image'}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  disabled={!formData.photo && !formData.photoUrl}
                  onClick={handleRemovePhoto}
                  sx={{
                    minWidth: 140,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    py: 1.25,
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 2,
              backgroundImage: 'none',
              bgcolor: 'background.paper',
              border: '1px solid rgba(211, 47, 47, 0.12)'
            }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 'bold' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary', fontSize: '16px' }}>
            Are you sure you want to delete this item? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={handleDeleteCancel} variant="text" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ px: 4, borderRadius: 3, fontWeight: 'bold' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuManager;


