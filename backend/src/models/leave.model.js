import mongoose from "mongoose";

// Leave Schema
const leaveSchema = new mongoose.Schema({
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String },
  reportedByDoctor: { type: Boolean, default: false }, // Indicates if the leave was reported by a doctor
  leftCampus: { type: Boolean, default: false }, // Tracks if the student left campus
});

// Medical Details Schema
const medicalDetailsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  parentEmail: { type: String, required: true }, // Parent's email for notifications
  yourAppointment: { type: Date },
  allottedLeaves: [leaveSchema],
  studentYear: { type: Number, required: true },
  studentDepartment: { type: String, required: true },
  registrationNo: { type: String, unique: true, required: true },
});

const MedicalDetails = mongoose.model("MedicalDetails", medicalDetailsSchema);
export default MedicalDetails;
