import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import routes
import studentRouter from "../src/routes/student.routes.js";
import facultyRouter from "../src/routes/faculty.routes.js";
import adminRouter from "../src/routes/admin.routes.js";
import doctorRouter from "../src/routes/doctor.routes.js";
import userDetailRouter from "../src/routes/userDetail.routes.js";
import votingRouter from "../src/routes/election.routes.js";
import cheatingRouter from "../src/routes/cheating.routes.js";
import bookingRouter from "../src/routes/booking.routes.js";
import facilityRoutes from "../src/routes/facility.routes.js";
import complaintRouter from "../src/routes/complaint.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import budgetRoutes from "./routes/budget.routes.js";

// Load environment variables
dotenv.config();

const app = express();

// ✅ Correct CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, sessions)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Ensure CORS Headers Are Sent
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Routes
app.use("/api/student-login", studentRouter);
app.use("/api/faculty-login", facultyRouter);
app.use("/api/details", userDetailRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/election", votingRouter);
app.use("/api/cheating", cheatingRouter);
app.use("/api/complaint", complaintRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/facilities", facilityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/budgets", budgetRoutes);

export { app };
