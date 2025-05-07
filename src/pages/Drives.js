import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Drives = () => {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/drives/upcoming').then(res => setDrives(res.data));
  }, []);

  return (
    <div className="mt-4">
      <h2>Upcoming Drives</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Vaccine</th>
            <th>Date</th>
            <th>Doses</th>
            <th>Classes</th>
          </tr>
        </thead>
        <tbody>
          {drives.map((d) => (
            <tr key={d._id}>
              <td>{d.vaccineName}</td>
              <td>{new Date(d.date).toLocaleDateString()}</td>
              <td>{d.dosesAvailable}</td>
              <td>{d.applicableClasses.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Drives;