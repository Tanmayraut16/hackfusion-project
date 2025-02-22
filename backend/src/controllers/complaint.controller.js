import { Filter } from "bad-words";
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
      return res
        .status(400)
        .json({ message: "Inappropriate language is not allowed" });
    }

    let proofUrl = "";

    // Check if a file was uploaded
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse) {
        return res
          .status(500)
          .json({ error: "File upload failed. Please try again." });
      }

      // If Cloudinary flagged the content as inappropriate, return an error
      if (cloudinaryResponse.error) {
        return res.status(400).json({
          error:
            "Inappropriate image or video detected. Please upload a valid proof.",
        });
      }

      proofUrl = cloudinaryResponse.url;
    }

    const complaint = new Complaint({
      content,
      submittedBy: req.user._id,
      isAnonymous,
      proofUrl,
    });

    await complaint.save();
    res
      .status(201)
      .json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to submit complaint", error: error.message });
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
          submittedBy: undefined, // Hide submittedBy if not revealed
        };
      }
      return complaint;
    });

    res.status(200).json(modifiedComplaints);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch complaints", error: error.message });
  }
};

// Vote to reveal identity
export const voteForReveal = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Ensure the 'votedBy' array exists on the complaint
    if (!complaint.votedBy) {
      complaint.votedBy = [];
    }

    // Check if the current user has already voted
    if (complaint.votedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Register the vote by adding the user's id to the 'votedBy' array
    complaint.votedBy.push(req.user._id);

    // Update the vote count based on the unique votes
    complaint.votesForReveal = complaint.votedBy.length;

    // Reveal identity if votes reach or exceed 10
    if (complaint.votesForReveal >= 10) {
      complaint.isApprovedForReveal = true;
    }

    await complaint.save();
    res.status(200).json({ message: "Vote registered", complaint });
  } catch (error) {
    res.status(500).json({ message: "Failed to vote", error: error.message });
  }
};

// Moderate complaints (only faculty)
// Only faculty can moderate
export const moderateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Use req.body.action to set complaint.status
    if (req.body.action === "approve") {
      complaint.status = "Approved";
    } else if (req.body.action === "reject") {
      complaint.status = "Rejected";
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action (use 'approve' or 'reject')" });
    }

    await complaint.save();
    res
      .status(200)
      .json({ message: `Complaint ${complaint.status}`, complaint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to moderate", error: error.message });
  }
};
