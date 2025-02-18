import mongoose from "mongoose";

const cheatingRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    examName: {
      type: String,
      required: true,
    },
    
    registrationNumber: { 
        type: String,
        required: true,
    },
    
  },
  { timestamps: true }
);

const CheatingRecord = mongoose.model("CheatingRecord", cheatingRecordSchema);
export default CheatingRecord;
