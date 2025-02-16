import express from "express";
import {
  registerFaculty,
  loginFaculty,
  getFaculty,
} from "../controllers/faculty.controller.js";
import {
  verifyFaculty,
  verifyFacultyOrAdmin,
} from "../middlewares/auth.middlware.js"; // Import Middleware
import Faculty from "../models/faculty.model.js";

const router = express.Router();

router.post("/register", registerFaculty);
router.post("/login", loginFaculty);

// Protected Routes (Require Faculty Authentication)
router.get("/profile", verifyFaculty, (req, res) => {
  res.json({ faculty: req.user });
});

// Only Faculty or Admin can access this route
router.get("/all", verifyFacultyOrAdmin, async (req, res) => {
  const facultyList = await Faculty.find({});
  res.json(facultyList);
});

export default router;
