import Application from "../models/application.model.js";
import ApprovalLog from "../models/approvalLog.model.js";

/**
 * Create a new application.
 * The user is extracted from `req.user` (set by authentication middleware).
 */
export const createApplication = async (req, res) => {
  try {
    const { category, description, priority } = req.body;
    const userId = req.user._id; // Extracted from authentication middleware

    let userModel = req.user.role; // e.g., "student" or "faculty"
    userModel =
      userModel.charAt(0).toUpperCase() + userModel.slice(1).toLowerCase();
    // console.log(userModel); // "Student" or "Faculty"

    // Validate userModel to ensure it's either Student or Faculty
    if (!["Student", "Faculty"].includes(userModel)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid user model" });
    }

    const application = new Application({
      user: userId,
      userModel,
      category,
      description,
      priority: priority || 1,
    });

    await application.save();
    return res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error("Error in createApplication:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get all applications.
 * Populates the user field dynamically (Student or Faculty).
 */
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate({
      path: "user",
      select: "name email role department",
    });

    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error("Error in getApplications:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get a single application by its ID.
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id).populate({
      path: "user",
      select: "name email role department",
    });

    if (!application) {
      return res
        .status(404)
        .json({ success: false, error: "Application not found" });
    }

    return res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error("Error in getApplicationById:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Approve an application.
 * The reviewer is extracted from `req.user`.
 */
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewer = req.user._id;
    const { comments } = req.body;
    let reviewerModel = req.user.role; // "Faculty" or "Admin"
    reviewerModel =
      reviewerModel.charAt(0).toUpperCase() +
      reviewerModel.slice(1).toLowerCase();

    const application = await Application.findById(id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, error: "Application not found" });
    }

    // Update application status
    application.status = "approved";
    await application.save();

    // Log the approval action
    const approvalLog = new ApprovalLog({
      application: id,
      reviewer,
      reviewerModel,
      action: "approved",
      comments,
    });
    await approvalLog.save();

    return res
      .status(200)
      .json({ success: true, data: { application, approvalLog } });
  } catch (error) {
    console.error("Error in approveApplication:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Reject an application.
 * The reviewer is extracted from `req.user`.
 */
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewer = req.user._id;
    const { comments } = req.body;
    let reviewerModel = req.user.role; // "Faculty" or "Admin"
    reviewerModel =
      reviewerModel.charAt(0).toUpperCase() +
      reviewerModel.slice(1).toLowerCase();

    const application = await Application.findById(id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, error: "Application not found" });
    }

    // Update application status
    application.status = "rejected";
    await application.save();

    // Log the rejection action
    const approvalLog = new ApprovalLog({
      application: id,
      reviewer,
      reviewerModel,
      action: "rejected",
      comments,
    });
    await approvalLog.save();

    return res
      .status(200)
      .json({ success: true, data: { application, approvalLog } });
  } catch (error) {
    console.error("Error in rejectApplication:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get all approval logs for a specific application.
 */
export const getApplicationLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await ApprovalLog.find({ application: id }).populate(
      "reviewer"
    );

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("Error in getApplicationLogs:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
