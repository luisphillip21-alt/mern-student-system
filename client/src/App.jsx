import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://mern-student-system.vercel.app/students';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    course: '',
    yearLevel: ''
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
      setFormData({ studentId: '', name: '', email: '', course: '', yearLevel: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      course: student.course,
      yearLevel: student.yearLevel
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ studentId: '', name: '', email: '', course: '', yearLevel: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Student Management System
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? 'Edit Student' : 'Add New Student'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="yearLevel"
              placeholder="Year Level"
              value={formData.yearLevel}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
            />
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-semibold"
              >
                {editingId ? 'Update Student' : 'Add Student'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.yearLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleEdit(student)}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;