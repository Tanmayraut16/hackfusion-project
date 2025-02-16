import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import studentRouter from "../src/routes/student.routes.js";
import facultyRouter from "../src/routes/faculty.routes.js";
import adminRouter from "../src/routes/admin.routes.js";
import doctorRouter from "../src/routes/doctor.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use("/api/student-login", studentRouter);
app.use("/api/faculty-login", facultyRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

export { app };
