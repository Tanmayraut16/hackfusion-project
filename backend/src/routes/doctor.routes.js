import express from "express";
import { loginDoctor, getDoctor } from "../controllers/doctor.controller.js";
import { verifyDoctor } from "../middlewares/auth.middlware.js";
import {
  allocateLeave,
  medicalDetailsRoute,
} from "../controllers/doctorOperations.controller.js";

const router = express.Router();

router.post("/login", loginDoctor);
router.get("/", verifyDoctor, getDoctor); // Only doctor can view their details
router.post("/allocateleave", allocateLeave); // Doctor can allocate leave
router.get("/medicaldetails", medicalDetailsRoute);

export default router;
