import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Admin",
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

const Admin = mongoose.model("Admin", adminSchema);

// Ensure Admin is created once
(async () => {
  const existingAdmin = await Admin.findOne({ email: "admin@sggs.ac.in" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    await Admin.create({ email: "admin@sggs.ac.in", password: hashedPassword });
    console.log("Default Admin Created");
  }
})();

export default Admin;
