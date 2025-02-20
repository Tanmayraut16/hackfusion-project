import {Filter} from "bad-words";
import Complaint from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const filter = new Filter();

export const submitComplaint = async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Check for vulgar words
    if (filter.isProfane(content)) {
      return res.status(400).json({ message: "Inappropriate language is not allowed" });
    }

    let proofUrl = "";

    // Check if a file was uploaded
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse) {
        return res.status(500).json({ error: "File upload failed. Please try again." });
      }

      // If Cloudinary flagged the content as inappropriate, return an error
      if (cloudinaryResponse.error) {
        return res.status(400).json({ error: "Inappropriate image or video detected. Please upload a valid proof." });
      }

      proofUrl = cloudinaryResponse.secure_url;
    }
    
        
    const complaint = new Complaint({
      content,
      submittedBy: req.user._id,
      isAnonymous,
      proofUrl,
    });

    await complaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit complaint", error: error.message });
  }
};



// Get all complaints

export const getAllComplaints = async (req, res) => {
    try {
      const complaints = await Complaint.find().populate("submittedBy", "name");
  
      // Modify complaints to hide submittedBy unless isApprovedForReveal is true
      const modifiedComplaints = complaints.map((complaint) => {
        if (!complaint.isApprovedForReveal) {
          return { 
            ...complaint.toObject(), 
            submittedBy: undefined // Hide submittedBy if not revealed
          };
        }
        return complaint;
      });
  
      res.status(200).json(modifiedComplaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
    }
  };
  

// Vote to reveal identity
export const voteForReveal = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.votesForReveal += 1;

    // If votes exceed a threshold (e.g., 3), reveal identity
    if (complaint.votesForReveal >= 1) {
      complaint.isApprovedForReveal = true;
    }

    await complaint.save();
    res.status(200).json({ message: "Vote registered", complaint });
  } catch (error) {
    res.status(500).json({ message: "Failed to vote", error: error.message });
  }
};

// Moderate complaints (only faculty)
export const moderateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = req.body.status; // "Approved" or "Rejected"
    await complaint.save();

    res.status(200).json({ message: `Complaint ${complaint.status}`, complaint });
  } catch (error) {
    res.status(500).json({ message: "Failed to moderate", error: error.message });
  }
};


