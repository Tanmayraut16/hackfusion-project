import Booking from "../models/booking.model.js";
import Facility from "../models/facility.model.js";

// Create a new booking (for Faculty or Student)
export const createBooking = async (req, res) => {
  try {
    const { facilityName, startTime, endTime, reason } = req.body;

    // Further validation
    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "startTime and endTime are required." });
    }

    // Verify that the facility exists (make sure to import Facility)
    const facilityObj = await Facility.findOne({ name: facilityName });
    
    if (!facilityObj) {
      return res.status(404).json({ message: "Facility not found" });
    }

    // Create the booking using the facility's ObjectId
    const booking = await Booking.create({
      user: req.user._id,
      facility: facilityObj._id, // use the facility's ObjectId instead of facilityName
      start_time: startTime,
      end_time: endTime,
      reason,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for the current user (or all bookings if admin)
export const getBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      // Non-admin users can only see their own bookings
      filter = {
        user: req.user._id,
        userType: req.user.role === "Student" ? "Student" : "Faculty",
      };
    }

    const bookings = await Booking.find(filter)
      .populate("facility")
      .populate("user");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get details of a single booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("facility")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only admins or the owner of the booking can view details
    if (
      req.user.role !== "admin" &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a booking (admin only)
export const approveBooking = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { approval_status: "approved" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optionally update the facility's status to booked when a booking is approved
    await Facility.findByIdAndUpdate(booking.facility, { status: "booked" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a booking (admin only)
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

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all facilities (visibility for both students and faculty)
export const listFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFacilityStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;


    if (!["available", "booked", "under_maintenance"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const facility = await Facility.findByIdAndUpdate(id, { status }, { new: true });

    if (!facility) return res.status(404).json({ error: "Facility not found" });

    res.status(200).json({ message: "Facility status updated", facility });
  } catch (error) {
    console.error("Error updating facility status:", error); // Log full error
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

