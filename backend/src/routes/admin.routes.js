import express from "express";
import { loginAdmin, getAdmin } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.middlware.js";

const router = express.Router();

router.post("/login", loginAdmin); // Only login route
router.get("/", getAdmin); // Get admin details
router.get("/", verifyAdmin, getAdmin);

export default router;
