import { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Snackbar, Alert } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1337';
const API_URL = rawApiUrl.replace(/\/$/, "");

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null });
  const showMessage = (msg, sev = 'success') => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/users`);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users`);
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users', err);
      }
    })();
  }, []);

  const handleOpen = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setOpen(true);
  };

  const handleEdit = (user) => {
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
        showMessage("User updated successfully!", "success");
      } else {
        // Create user
        await axios.post(`${API_URL}/api/users`, payload);
        showMessage("User created successfully!", "success");
      }

      fetchUsers();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || `Error ${editingId ? 'updating' : 'creating'} user`);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, userId: id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.userId;
    setDeleteConfirm({ open: false, userId: null });
    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      showMessage("Deleted successfully!", "success");
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
      showMessage("Delete failed!", "error");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, userId: null });
    showMessage("Delete Cancelled!", "info");
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2 }}>
      {/* Centered Title */}
      <Typography variant="h2" align="center" sx={{ fontWeight: 900, color: 'text.primary', mb: 4, mt: 4, letterSpacing: '-1px' }}>
        Users List
      </Typography>

      {/* Add User Action above Table */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{ py: 1.5, px: 4, borderRadius: 3, fontSize: '16px', fontWeight: 800 }}
        >
          Add User
        </Button>
      </Box>

      {/* Simplified, Clean Table Container */}
      <TableContainer component={Box} sx={{ bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden', mb: 6 }}>
        <Table>
          <TableBody>
            {/* Headers row */}
            <TableRow>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "18px", fontWeight: 700, pb: 2, pl: 0 }}>Name</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "18px", fontWeight: 700, pb: 2 }}>Email</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.12)", fontSize: "18px", fontWeight: 700, pb: 2 }}>Password</TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}></TableCell>
            </TableRow>

            {/* User Data rows */}
            {users.map((user, index) => (
              <TableRow key={user._id || index}>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 3, fontSize: "1rem", pl: 0 }}>
                  {user.name}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 3, fontSize: "16px" }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.08)", py: 3, fontSize: "16px" }}>
                  {user.password}
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 3 }} align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(user)}
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
                      handleDeleteClick(user._id);
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



      {/* Dialog for Create/Edit */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3, // Match 12px rounding of login form container
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
            {editingId ? 'Edit User' : 'Add User'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {error && <Typography color="error" sx={{ mb: 3, textAlign: 'center', bgcolor: 'rgba(255, 82, 82, 0.1)', p: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '14px' }}>{error}</Typography>}

          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
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
            sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold', fontSize: '16px' }}
          >
            {editingId ? 'Save Changes' : 'Add User'}
          </Button>
          <Button fullWidth onClick={handleClose} variant="text" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Cancel
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
            Are you sure you want to delete this user? This action cannot be undone.
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

export default UserManager;


