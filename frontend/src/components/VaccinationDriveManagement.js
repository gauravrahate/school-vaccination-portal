import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const VaccinationDriveManagement = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [formData, setFormData] = useState({
    vaccineName: '',
    date: '',
    availableDoses: '',
    applicableClasses: []
  });
  const { user } = useAuth();

  const classOptions = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
                       'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];

  const fetchDrives = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/drives', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDrives(response.data);
    } catch (err) {
      setError('Failed to fetch vaccination drives');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDrive) {
        await axios.put(
          `http://localhost:5000/api/drives/${selectedDrive._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/drives',
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      }
      setOpenDialog(false);
      fetchDrives();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vaccination drive');
      console.error('Save error:', err);
    }
  };

  const handleEdit = (drive) => {
    setSelectedDrive(drive);
    setFormData({
      vaccineName: drive.vaccineName,
      date: new Date(drive.date).toISOString().split('T')[0],
      availableDoses: drive.availableDoses,
      applicableClasses: drive.applicableClasses
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vaccination drive?')) {
      try {
        await axios.delete(`http://localhost:5000/api/drives/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchDrives();
      } catch (err) {
        setError('Failed to delete vaccination drive');
        console.error('Delete error:', err);
      }
    }
  };

  const resetForm = () => {
    setSelectedDrive(null);
    setFormData({
      vaccineName: '',
      date: '',
      availableDoses: '',
      applicableClasses: []
    });
  };

  const canEditDrive = (drive) => {
    return new Date(drive.date) > new Date();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Vaccination Drive Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          Schedule New Drive
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vaccine Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Available Doses</TableCell>
              <TableCell>Applicable Classes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drives.map((drive) => (
              <TableRow key={drive._id}>
                <TableCell>{drive.vaccineName}</TableCell>
                <TableCell>{new Date(drive.date).toLocaleDateString()}</TableCell>
                <TableCell>{drive.availableDoses}</TableCell>
                <TableCell>
                  {drive.applicableClasses.map((cls) => (
                    <Chip key={cls} label={cls} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>{drive.status}</TableCell>
                <TableCell>
                  {canEditDrive(drive) && (
                    <>
                      <IconButton onClick={() => handleEdit(drive)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(drive._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDrive ? 'Edit Vaccination Drive' : 'Schedule New Vaccination Drive'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Vaccine Name"
              value={formData.vaccineName}
              onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Available Doses"
              type="number"
              value={formData.availableDoses}
              onChange={(e) => setFormData({ ...formData, availableDoses: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Applicable Classes</InputLabel>
              <Select
                multiple
                value={formData.applicableClasses}
                onChange={(e) => setFormData({ ...formData, applicableClasses: e.target.value })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {classOptions.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedDrive ? 'Update' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VaccinationDriveManagement; 