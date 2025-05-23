import express from "express";
import {
  getStudents,
  deleteStudent,
  getAllStudents,
} from "../controllers/student.controller.js";
import {
  getFaculty,
  deleteFaculty,
} from "../controllers/faculty.controller.js";
import { verifyAdmin } from "../middlewares/auth.middlware.js";

const router = express.Router();

router.get("/students", verifyAdmin, getStudents);
router.get("/faculty", verifyAdmin, getFaculty);

router.get("/allStudents", verifyAdmin, getAllStudents);

router.delete("/students/:id", verifyAdmin, deleteStudent);
router.delete("/faculty/:id", verifyAdmin, deleteFaculty);

export default router;
