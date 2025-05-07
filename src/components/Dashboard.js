import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/drives/dashboard', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setMetrics(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Total Drives Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Vaccination Drives
            </Typography>
            <Typography component="p" variant="h4">
              {metrics?.totalDrives || 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Upcoming Drives Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Upcoming Drives (Next 30 Days)
            </Typography>
            {metrics?.drivesNext30Days?.length > 0 ? (
              metrics.drivesNext30Days.map((drive) => (
                <Box key={drive._id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    {new Date(drive.date).toLocaleDateString()} - {drive.vaccineName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Classes: {drive.applicableClasses.join(', ')}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No upcoming drives in the next 30 days
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Drives Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Drives
            </Typography>
            {metrics?.upcomingDrives?.length > 0 ? (
              metrics.upcomingDrives.map((drive) => (
                <Box key={drive._id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    {new Date(drive.date).toLocaleDateString()} - {drive.vaccineName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Doses: {drive.availableDoses}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No recent drives
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 