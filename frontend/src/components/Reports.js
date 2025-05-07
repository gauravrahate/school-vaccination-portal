import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    vaccineName: '',
    status: '',
    class: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user } = useAuth();

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${user.token}` },
        params: filters
      });
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch student data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, user.token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToExcel = () => {
    const data = students.map(student => ({
      'Student ID': student.studentId,
      'Name': student.name,
      'Class': student.class,
      'Date of Birth': new Date(student.dateOfBirth).toLocaleDateString(),
      'Vaccinations': student.vaccinations.map(v => 
        `${v.vaccineName} (${v.status}) - ${v.date ? new Date(v.date).toLocaleDateString() : 'Not vaccinated'}`
      ).join(', ')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vaccination Report');
    XLSX.writeFile(wb, 'vaccination_report.xlsx');
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
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Vaccination Reports
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Vaccine Name</InputLabel>
            <Select
              value={filters.vaccineName}
              onChange={(e) => handleFilterChange('vaccineName', e.target.value)}
              label="Vaccine Name"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="COVID-19">COVID-19</MenuItem>
              <MenuItem value="MMR">MMR</MenuItem>
              <MenuItem value="Hepatitis B">Hepatitis B</MenuItem>
              <MenuItem value="Polio">Polio</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
              label="Class"
            >
              <MenuItem value="">All</MenuItem>
              {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
                'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map(grade => (
                <MenuItem key={grade} value={grade}>{grade}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={exportToExcel}
            sx={{ ml: 'auto' }}
          >
            Export to Excel
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Vaccination Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {student.vaccinations.map((vaccination, index) => (
                        <Box key={index} sx={{ mb: 0.5 }}>
                          {vaccination.vaccineName}: {vaccination.status}
                          {vaccination.date && ` (${new Date(vaccination.date).toLocaleDateString()})`}
                        </Box>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={students.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Reports; 