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

export const getStudents = async (req, res) => {
  console.log("i am in students");

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find().skip(skip).limit(limit);
    const totalStudents = await Student.countDocuments();

    res.status(200).json({
      data: students,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving students", error });
  }
};

export const getAllStudents = async (_req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ data: students });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving all students", error });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing student", error });
  }
};

// GET student details by ID
const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params; // Extract studentId from URL params
    const student = await Student.findById(studentId);
    console.log(student);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      studentId: student._id,
      name: student.name,
      email: student.email,
      role: "Student",
      department: student.department,
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { loginStudent, registerStudent, getStudentById }; // Corrected export
