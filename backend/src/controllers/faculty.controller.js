import Faculty from "../models/faculty.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerFaculty = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // Check if faculty exists
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty)
      return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create faculty
    const newFaculty = new Faculty({
      name,
      email,
      password: hashedPassword,
      department,
    });

    await newFaculty.save();
    res.status(201).json({ message: "Faculty registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if faculty exists
    const faculty = await Faculty.findOne({ email });
    if (!faculty)
      return res.status(400).json({ message: "Invalid email or password" });

    // Verify password
    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate token
    const token = jwt.sign(
      { id: faculty._id, role: faculty.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ token, faculty });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id).select("-password");
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
