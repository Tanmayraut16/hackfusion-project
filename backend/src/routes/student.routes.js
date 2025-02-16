import express from "express";
import {
  loginStudent,
  registerStudent,
} from "../controllers/student.controller.js";
import { verifyStudent } from "../middlewares/auth.middlware.js"; // Import Middleware

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Protected Routes (Require Student Authentication)
router.get("/profile", verifyStudent, (req, res) => {
  res.json({ student: req.user });
});

export default router;
