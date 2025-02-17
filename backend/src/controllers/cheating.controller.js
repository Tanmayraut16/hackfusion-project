import CheatingRecord from "../models/cheatingrecord.model.js";
import Student from "../models/students.model.js";

// Add a new cheating record (Faculty only)
export const addCheatingRecord = async (req, res) => {
  try {
    const { registrationNumber, reason, examName } = req.body;
    
    // //current user is faculty no need to check faculty role 
    
    if (req.user.role !== "faculty") {
      return res.status(403).json({ error: "Only faculty can report cheating cases" });
    }

    // Construct the student's email using the registration number
    const studentEmail = `${registrationNumber}@sggs.ac.in`;

    
  
    // Find the student using the email
    const student = await Student.findOne({ email: studentEmail });
  
    
    if (!student) {
      return res.status(404).json({ error: "Student not found with this registration number" });
    }

    const newRecord = new CheatingRecord({
      student: student._id,
      reason,
      reportedBy: req.user._id, // Faculty ID
      examName,
      registrationNumber,
    });

    console.log(newRecord);
    

    await newRecord.save();
    
    res.status(201).json({ message: "Cheating record added successfully", record: newRecord });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get all cheating records (Public for all students & faculty)
export const getCheatingRecords = async (req, res) => {
  try {
    const records = await CheatingRecord.find()
      .populate("student", "name email")
      .populate("reportedBy", "name email");

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a cheating record (Admin only)
export const deleteCheatingRecord = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete cheating records" });
    }

    const { id } = req.params;
    await CheatingRecord.findByIdAndDelete(id);
    res.status(200).json({ message: "Cheating record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
