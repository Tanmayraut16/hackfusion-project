// backend/src/models/Application.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const applicationSchema = new Schema(
  {
    // The applicant can be a Student or Faculty (use refPath for dynamic reference)
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    // This field determines which model the user field refers to
    userModel: {
      type: String,
      required: true,
      enum: ["Student", "Faculty"],
    },
    category: {
      type: String,
      enum: ["event", "budget", "sponsorship"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    priority: {
      type: Number,
      default: 1, // Higher value for unattended/urgent applications
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model("Application", applicationSchema);
