import MedicalDetails from "../models/leave.model.js";
import Student from "../models/students.model.js"; // Import Student Model
import Teacher from "../models/faculty.model.js";
import { sendEmail } from "../utils/emailService.js";

/**
 * Allocate leave for a student and send notifications.
 */
export const allocateLeave = async (req, res) => {
  const {
    email, // Searching by email
    registrationNo, // Taken from req.body
    studentYear, // Taken from req.body
    parentEmail,
    fromDate,
    toDate,
    reason,
    reportedByDoctor = false,
    leftCampus = false,
  } = req.body;

  // Validate required fields
  if (!email || !registrationNo || !studentYear || !fromDate || !toDate) {
    return res.status(400).json({
      error:
        "Missing required fields: email, registrationNo, studentYear, fromDate, or toDate.",
    });
  }

  try {
    // Find student in the Student collection using email
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    const studentId = student._id;

    // Find existing medical record or create a new one
    let medicalRecord = await MedicalDetails.findOne({ studentId });

    if (!medicalRecord) {
      if (!parentEmail) {
        return res.status(400).json({
          error: "Parent email is required for new student medical record.",
        });
      }

      medicalRecord = new MedicalDetails({
        studentId,
        studentName: student.name,
        email: student.email,
        parentEmail,
        registrationNo,
        studentDepartment: student.department,
        studentYear, // Taken from req.body
        allottedLeaves: [],
      });
    }

    // Add leave entry
    medicalRecord.allottedLeaves.push({
      fromDate,
      toDate,
      reason,
      reportedByDoctor,
      leftCampus,
    });

    // Save updated record
    await medicalRecord.save();

    // Fetch class coordinator based on department and year
    const coordinator = await Teacher.findOne({
      department: student.department,
      role: "faculty",
    });

    // If reported by a doctor, notify the class coordinator
    if (reportedByDoctor && coordinator) {
      await sendEmail(
        coordinator.email,
        `Student Reported Sick: ${student.name}`,
        `Dear ${coordinator.name},\n\nThe student ${student.name} (Reg: ${registrationNo}) from year ${studentYear} has been reported sick by the doctor.\n\nLeave Period: ${fromDate} to ${toDate}.\n\nBest,\nMediCare System`
      );
    }

    // If student leaves campus, notify the parents
    if (leftCampus) {
      await sendEmail(
        parentEmail,
        `Student Left Campus: ${student.name}`,
        `Dear Parent,\n\nWe want to inform you that your child ${student.name} (Reg: ${registrationNo}) has left the campus on ${fromDate}. \n\nThis is for safety tracking purposes.\n\nBest,\nMediCare System`
      );
    }

    res.status(200).json({
      message: "Leave allocated and notifications sent successfully.",
    });
  } catch (error) {
    console.error("Error allocating leave:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
