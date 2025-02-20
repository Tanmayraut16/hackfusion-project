import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  getApplicationLogs,
} from "../controllers/application.controller.js";
import {
  verifyToken,
  verifyStudentOrFaculty,
  verifyFacultyOrAdmin,
} from "../middlewares/auth.middlware.js";

const router = express.Router();

// Inline middleware to allow student, faculty, and admin to view applications
const verifyStudentFacultyAdmin = (req, res, next) =>
  verifyToken(req, res, next, ["student", "faculty", "admin"]);

// GET /applications
// Accessible to students, faculty, and admin
router.get("/", verifyStudentFacultyAdmin, getApplications);

// GET /applications/:id
// Accessible to students, faculty, and admin
router.get("/:id", verifyStudentFacultyAdmin, getApplicationById);

// POST /applications
// Only students and faculty can create applications
router.post("/", verifyStudentOrFaculty, createApplication);

// POST /applications/:id/approve
// Only faculty and admin can approve an application
router.post("/:id/approve", verifyFacultyOrAdmin, approveApplication);

// POST /applications/:id/reject
// Only faculty and admin can reject an application
router.post("/:id/reject", verifyFacultyOrAdmin, rejectApplication);

// GET /applications/:id/logs
// Only faculty and admin can view approval logs
router.get("/:id/logs", verifyFacultyOrAdmin, getApplicationLogs);

export default router;
