import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [age, setAge] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'https://mern-student-system.vercel.app/students';

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !course || !age) return;

    try {
      const studentData = { name, course, age: Number(age) };

      if (editingId) {
        // UPDATE (PUT)
        await axios.put(`${API_URL}/${editingId}`, studentData);
        alert('Student updated successfully!');
      } else {
        // CREATE (POST)
        const res = await axios.post(API_URL, studentData);
        console.log("Successfully Added:", res.data);
        alert('Student added successfully!');
      }

      // Reset Form & Editing State
      setEditingId(null);
      setName('');
      setCourse('');
      setAge('');
      
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      // MAG-ALERT NG ERROR SA SCREEN
      alert('FAILED TO SAVE: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setCourse('');
    setAge('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      if (editingId === id) {
        handleCancelEdit();
      }
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Management System</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Name: </label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Course: </label>
          <input 
            type="text" 
            value={course} 
            onChange={(e) => setCourse(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Age: </label>
          <input 
            type="number" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            required 
          />
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <button type="submit">
            {editingId ? 'Update Student' : 'Add Student'}
          </button>
          
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <hr />

      <h3>Student List</h3>
      {/* Palitan ang <ul> tag nito: */}
<ul style={{ listStyleType: 'none', padding: 0 }}>
  {students.map((student) => (
    <li key={student._id} style={{ marginBottom: '10px' }}>
      <strong>{student.name}</strong> - {student.course} - Age: {student.age}{' '}
      <button type="button" onClick={() => handleEdit(student)}>Edit</button>{' '}
      <button type="button" onClick={() => handleDelete(student._id)}>Delete</button>
    </li>
  ))}
</ul>
    </div>
  );
}

export default App;