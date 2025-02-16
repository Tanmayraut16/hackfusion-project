import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Doctor",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

// Ensure Doctor is created only once
(async () => {
  const existingDoctor = await Doctor.findOne({ email: "doctor@sggs.ac.in" });
  if (!existingDoctor) {
    const hashedPassword = await bcrypt.hash("Doctor@123", 10);
    await Doctor.create({
      email: "doctor@sggs.ac.in",
      password: hashedPassword,
    });
    console.log("Default Doctor Created");
  }
})();

export default Doctor;
