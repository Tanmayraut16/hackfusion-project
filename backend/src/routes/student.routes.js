import express from "express";
import {
  getStudentById,
  loginStudent,
  registerStudent,
} from "../controllers/student.controller.js";
import { verifyStudent } from "../middlewares/auth.middlware.js"; // Import Middleware

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Protected Routes (Require Student Authentication)
router.get("/profile", (req, res) => {
  res.json({ student: req.user });
});
router.get("/profile/:studentId", getStudentById);

export default router;
