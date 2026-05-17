import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Delete, Add, Security, AdminPanelSettings, Close, Edit } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/users`);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  const handleOpen = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setOpen(true);
  };

  const handleEdit = (user, index) => {
    setEditingId(user._id);
    setFormData({ name: user.name || '', email: user.email || '', password: user.password || '' });
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };

      if (editingId) {
        // Update user
        await axios.put(`${API_URL}/api/users/${editingId}`, payload);
      } else {
        // Create user
        await axios.post(`${API_URL}/api/users`, payload);
      }

      fetchUsers();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || `Error ${editingId ? 'updating' : 'creating'} user`);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this administrator?");

    if (!confirmDelete) {
      alert("Delete Cancelled!");
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      alert("Deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
      alert("Delete failed!");
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2 }}>
      {/* Centered Title */}
      <Typography variant="h2" align="center" sx={{ fontWeight: 900, color: 'text.primary', mb: 8, mt: 4, letterSpacing: '-1px' }}>
        Users List
      </Typography>

      {/* Simplified, Clean Table Container */}
      <TableContainer component={Box} sx={{ bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden', mb: 6 }}>
        <Table>
          <TableBody>
            {/* Headers row */}
            <TableRow>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "1.1rem", fontWeight: 700, pb: 2, pl: 0 }}>Name</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "1.1rem", fontWeight: 700, pb: 2 }}>Email</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "1.1rem", fontWeight: 700, pb: 2 }}>Password</TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}></TableCell>
            </TableRow>

            {/* User Data rows */}
            {users.map((user, index) => (
              <TableRow key={user._id || index}>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 3, fontSize: "1rem", pl: 0 }}>
                  {user.name}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 3, fontSize: "1rem" }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 3, fontSize: "1rem" }}>
                  {user.password}
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 3 }} align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(user, index)}
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
                      handleDeleteUser(user._id);
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

      {/* Button to Create Admin - simple and bottom-aligned or cleanly styled */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{ py: 1.8, px: 5, borderRadius: 3, fontSize: '1rem', fontWeight: 800 }}
        >
          Add User
        </Button>
      </Box>

      {/* Dialog for Create/Edit */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
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
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>
            {editingId ? 'Edit Admin' : 'New Admin'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 4, mt: 1 }}>
            <Avatar sx={{ mx: 'auto', mb: 2, background: 'rgba(211, 47, 47, 0.1)', color: 'primary.main', width: 64, height: 64 }}>
              <AdminPanelSettings fontSize="large" />
            </Avatar>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {editingId ? 'Update User Account .' : 'Add User Account'}
            </Typography>
          </Box>

          {error && <Typography color="error" sx={{ mb: 3, textAlign: 'center', bgcolor: 'rgba(255, 82, 82, 0.1)', p: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '0.85rem' }}>{error}</Typography>}

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              placeholder="e.g. John Paul Dres"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              placeholder="e.g. johnpaul00504@gmail.com"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="text" // Shown in plain text as requested in screenshot edit/displays
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
              placeholder="e.g. jp1234"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.name || !formData.email || !formData.password}
            sx={{ py: 2, borderRadius: 3, fontWeight: 900, fontSize: '1rem' }}
          >
            {editingId ? 'Save Changes' : 'Add User'}
          </Button>
          <Button fullWidth onClick={handleClose} sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManager;


