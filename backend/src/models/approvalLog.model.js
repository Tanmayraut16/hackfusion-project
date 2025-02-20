// backend/src/models/ApprovalLog.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const approvalLogSchema = new Schema({
  application: {
    type: Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "reviewerModel"
  },
  // Specifies the model for reviewer: could be Faculty or Admin
  reviewerModel: {
    type: String,
    required: true,
    enum: ["Faculty", "Admin"]
  },
  action: {
    type: String,
    enum: ["approved", "rejected"],
    required: true
  },
  comments: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: false });

export default model("ApprovalLog", approvalLogSchema);
