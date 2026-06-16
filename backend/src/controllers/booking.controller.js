import Booking from "../models/booking.model.js";
import Facility from "../models/facility.model.js";

// Create a new booking (for Faculty or Student)
export const createBooking = async (req, res) => {
  try {
    const { facilityId, startTime, endTime, reason, userType } = req.body;

    // 1. Basic Validation
    if (!startTime || !endTime || !facilityId) {
      return res.status(400).json({ message: "Facility, start time, and end time are required." });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ message: "End time must be after start time." });
    }

    // 2. Verify that the facility exists
    const facilityObj = await Facility.findById(facilityId);
    if (!facilityObj) {
      return res.status(404).json({ message: "Facility not found" });
    }

    // 3. Prevent Overlapping Bookings (Double Booking Check)
    const overlapping = await Booking.findOne({
      facility: facilityId,
      approval_status: "approved",
      $or: [
        { start_time: { $lt: end, $gte: start } }, // New booking starts during an old one
        { end_time: { $gt: start, $lte: end } },   // New booking ends during an old one
        { start_time: { $lte: start }, end_time: { $gte: end } }, // New booking completely covers an old one
      ],
    });

    if (overlapping) {
      return res.status(400).json({ 
        message: "This facility is already reserved for the selected time slot." 
      });
    }

    // 4. Create the booking using the facility's ObjectId
    const booking = await Booking.create({
      user: req.user._id,
      userModel: userType || (req.user.role === "admin" ? "User" : "Student"), // Dynamic reference
      facility: facilityId,
      start_time: start,
      end_time: end,
      reason,
      approval_status: "pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (Admin sees all, Users see theirs)
export const getBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      filter = { user: req.user._id };
    }

    const bookings = await Booking.find(filter)
      .populate("facility")
      .populate("user");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a booking (Admin only)
export const approveBooking = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find and update the booking status
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { approval_status: "approved" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the facility's status to booked immediately upon approval
    // The cronService will reset this once the end_time passes
    await Facility.findByIdAndUpdate(booking.facility, { status: "booked" });

    res.status(200).json({ message: "Booking approved and facility locked", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a booking (Admin only)
export const rejectBooking = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { approval_status: "rejected" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking rejected", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single booking details
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("facility")
      .populate("user");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "admin" && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List facilities (Helper for UI)
export const listFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyBooking = async (req, res) => {
  try {
    // 1. Find the booking and populate user/facility details
    const booking = await Booking.findById(req.params.id)
      .populate("facility")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ valid: false, message: "Invalid Booking ID" });
    }

    const now = new Date();
    
    // 2. Check if the booking is currently active
    const isTimely = now >= booking.start_time && now <= booking.end_time;
    const isApproved = booking.approval_status === "approved";

    if (isApproved && isTimely) {
      return res.status(200).json({
        valid: true,
        studentName: booking.user.name,
        facilityName: booking.facility.name,
        message: "Access Granted"
      });
    } else {
      return res.status(400).json({
        valid: false,
        message: !isApproved ? "Booking not approved" : "Booking expired or not yet started"
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};