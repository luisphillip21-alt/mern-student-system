const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();

app.use(cors());
app.use(express.json());

// 1. READ: GET /students (Kumuha ng lahat ng estudyante)[cite: 4, 7]
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. CREATE: POST /students (Magdagdag ng bagong estudyante)[cite: 3, 7]
app.post('/students', async (req, res) => {
  try {
    const { name, course, age } = req.body;
    const newStudent = new Student({ name, course, age: Number(age) });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. UPDATE: PUT /students/:id (Mag-update ng umiiral na estudyante)[cite: 6, 7]
app.put('/students/:id', async (req, res) => {
  try {
    const { name, course, age } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, course, age: Number(age) },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE: DELETE /students/:id (Magbura ng estudyante)[cite: 5, 7]
app.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://studentuser:Test1234@cluster0.ebekgkb.mongodb.net/studentsDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("MongoDB Connection Error:", err));