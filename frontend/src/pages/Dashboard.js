import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    vaccinated: 0,
    upcomingDrives: []
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard')
      .then((response) => {
        setData(response.data);  // Populate data from backend
      })
      .catch((error) => console.error('Error fetching dashboard data:', error));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Total Students</h5>
              <p>{data.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Vaccinated Students</h5>
              <p>{data.vaccinated}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Upcoming Drives</h5>
              <ul>
                {data.upcomingDrives.length > 0 ? (
                  data.upcomingDrives.map((drive) => (
                    <li key={drive.id}>{drive.name} - {drive.date}</li>
                  ))
                ) : (
                  <li>No upcoming drives</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
