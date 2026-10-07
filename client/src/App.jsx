import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://mern-student-system.vercel.app/students';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    course: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: '', age: '', course: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name || '',
      age: student.age || '',
      course: student.course || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', age: '', course: '' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', color: '#1f2937', marginBottom: '24px' }}>
          Student Management System
        </h1>

        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
            {editingId ? 'Edit Student' : 'Add New Student'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }}
              />
              <input
                type="text"
                name="course"
                placeholder="Course"
                value={formData.course}
                onChange={handleChange}
                required
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{ flex: 1, backgroundColor: '#2563eb', color: '#ffffff', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
              >
                {editingId ? 'Update Student' : 'Add Student'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{ flex: 1, backgroundColor: '#6b7280', color: '#ffffff', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
          Student List ({students.length})
        </h2>

        {students.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', textAlign: 'center', borderRadius: '8px', color: '#6b7280' }}>
            No students found. Add one above!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {students.map((student) => (
              <div 
                key={student._id} 
                style={{
                  backgroundColor: '#ffffff',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  borderLeft: '6px solid #2563eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 6px 0' }}>
                    {student.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', color: '#4b5563', fontSize: '14px' }}>
                    <span><strong>Age:</strong> {student.age}</span>
                    <span><strong>Course:</strong> {student.course}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handleEdit(student)}
                    style={{
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;