import express from "express";
import {
  submitComplaint,
  getAllComplaints,
  voteForReveal,
  moderateComplaint,
} from "../controllers/complaint.controller.js";
import {
  verifyStudent,
  verifyFacultyOrAdmin,
} from "../middlewares/auth.middlware.js";
import { upload } from "../middlewares/multer.middlware.js";

const router = express.Router();

// Complaint Routes
router.post("/submit", verifyStudent, upload.single("proof"), submitComplaint); // Only students can submit
router.get("/all", getAllComplaints); // Faculty & Admin can view all
router.put("/vote/:id", verifyFacultyOrAdmin, voteForReveal); // Students can vote to reveal
router.put("/moderate/:id", verifyFacultyOrAdmin, moderateComplaint); // Only faculty can moderate

export default router;
