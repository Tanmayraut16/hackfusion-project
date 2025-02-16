// models/Student.js
import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // match: /^[a-zA-Z0-9._%+-]+@sggs\.ac\.in$/,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "faculty",
    },
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
