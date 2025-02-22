import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    proofUrl: { type: String },
    isAnonymous: { type: Boolean, default: true },
    isApprovedForReveal: { type: Boolean, default: false },
    votesForReveal: { type: Number, default: 0 },
    votedBy: { type: [mongoose.Schema.Types.ObjectId], default: [] }, // Added field
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
