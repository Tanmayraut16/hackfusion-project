import express from "express";
import {
  addCheatingRecord,
  getCheatingRecords,
  deleteCheatingRecord,
} from "../controllers/cheating.controller.js";
import { verifyFaculty, verifyAdmin } from "../middlewares/auth.middlware.js";

const router = express.Router();

// Route to add a cheating record (Only faculty can add)
router.post("/add", verifyFaculty, addCheatingRecord);

// Route to get all cheating records (Public)
router.get("/all", getCheatingRecords);

// Route to delete a cheating record (Only admin can delete)
router.delete("/delete/:id", verifyAdmin, deleteCheatingRecord);

export default router;
