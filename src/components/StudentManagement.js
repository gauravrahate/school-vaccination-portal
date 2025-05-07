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
  DialogActions
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    class: '',
    dateOfBirth: ''
  });
  const { user } = useAuth();

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStudent) {
        await axios.put(
          `http://localhost:5000/api/students/${selectedStudent._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/students',
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      }
      setOpenDialog(false);
      fetchStudents();
      resetForm();
    } catch (err) {
      setError('Failed to save student');
      console.error('Save error:', err);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      class: student.class,
      dateOfBirth: new Date(student.dateOfBirth).toISOString().split('T')[0]
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        console.log('Attempting to delete student:', id);
        const response = await axios.delete(`http://localhost:5000/api/students/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (response.data.message) {
          setError(''); // Clear any existing errors
          console.log('Student deleted successfully:', response.data);
          fetchStudents(); // Refresh the list
        }
      } catch (err) {
        console.error('Delete error:', err);
        const errorMessage = err.response?.data?.message || 'Failed to delete student';
        const errorDetails = err.response?.data?.details || '';
        setError(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/students/bulk-import', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchStudents();
    } catch (err) {
      setError('Failed to import students');
      console.error('Import error:', err);
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setFormData({
      studentId: '',
      name: '',
      class: '',
      dateOfBirth: ''
    });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Student Management
        </Typography>
        <Box>
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="csv-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="csv-upload">
            <Button variant="outlined" component="span" sx={{ mr: 2 }}>
              Import CSV
            </Button>
          </label>
          <Button
            variant="contained"
            onClick={() => {
              resetForm();
              setOpenDialog(true);
            }}
          >
            Add Student
          </Button>
        </Box>
      </Box>

      <TextField
        fullWidth
        label="Search Students"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(student)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(student._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedStudent ? 'Edit Student' : 'Add New Student'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Student ID"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Class"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedStudent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentManagement; 