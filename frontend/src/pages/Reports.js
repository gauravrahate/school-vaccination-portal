import React, { useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [vaccine, setVaccine] = useState('');
  const [students, setStudents] = useState([]);

  const fetchReport = () => {
    axios.get(`http://localhost:5000/api/reports?vaccine=${vaccine}`).then(res => setStudents(res.data));
  };

  return (
    <div className="mt-4">
      <h2>Reports</h2>
      <div className="mb-3">
        <label>Filter by Vaccine</label>
        <input value={vaccine} onChange={e => setVaccine(e.target.value)} className="form-control" />
      </div>
      <button className="btn btn-primary mb-3" onClick={fetchReport}>Generate Report</button>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Vaccinations</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>
                <ul>
                  {s.vaccinations.map((v, i) => (
                    <li key={i}>{v.vaccine} - {new Date(v.date).toLocaleDateString()}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;