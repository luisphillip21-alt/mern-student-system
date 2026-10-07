const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


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