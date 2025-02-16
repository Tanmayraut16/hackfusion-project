import express from "express";
import { loginDoctor, getDoctor } from "../controllers/doctor.controller.js";
import { verifyDoctor } from "../middlewares/auth.middlware.js";
import { allocateLeave } from "../controllers/doctorOperations.controller.js";

const router = express.Router();

router.post("/login", loginDoctor);
router.get("/", verifyDoctor, getDoctor); // Only doctor can view their details
router.post("/allocateleave", allocateLeave); // Doctor can allocate leave

export default router;
