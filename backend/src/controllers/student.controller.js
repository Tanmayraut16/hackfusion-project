// controllers/studentController.js
import Student from "../models/students.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new student
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if the student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new student
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      role, // Store hashed password,
      department,
    });

    await student.save();

    res.status(201).json({
      message: "Student registered. Please wait for admin verification.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login for verified students
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { studentId: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({ message: "Student login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { loginStudent, registerStudent }; // Corrected export
