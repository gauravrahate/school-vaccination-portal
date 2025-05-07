import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '',
    vaccineStatus: false
  });

  // Fetch students when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleAddStudent = () => {
    axios.post('http://localhost:5000/api/students', newStudent)
      .then(response => {
        setStudents([...students, response.data]);
        setNewStudent({ name: '', grade: '', vaccineStatus: false });
      })
      .catch(error => console.error('Error adding student:', error));
  };

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:5000/api/students/bulk-upload', formData)
      .then(response => {
        alert('Students uploaded successfully');
        // Optionally, refresh the student list after upload
        return axios.get('http://localhost:5000/api/students');
      })
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => console.error('Error uploading file:', error));
  };

  return (
    <div className="container mt-5">
      <h2>Manage Students</h2>
      <form>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Grade</label>
          <input
            type="text"
            className="form-control"
            value={newStudent.grade}
            onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleAddStudent}>
          Add Student
        </button>
      </form>

      <hr />
      <h4>Bulk Upload</h4>
      <input type="file" onChange={handleBulkUpload} />
      <hr />

      <h4>Student List</h4>
      <ul>
        {students.map((student, index) => (
          <li key={index}>{student.name} - {student.grade}</li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
