import cron from "node-cron";
import Application from "./models/application.model.js";
import Booking from "./models/booking.model.js";
import Facility from "./models/facility.model.js";

// Scheduler for Application Priority Escalation
cron.schedule("* * * * *", async () => {
  try {
    console.log(
      "Priority escalation task running at",
      new Date().toISOString()
    );
    const ESCALATION_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour
    const thresholdTime = new Date(Date.now() - ESCALATION_THRESHOLD_MS);

    const applications = await Application.find({
      status: "pending",
      created_at: { $lte: thresholdTime },
    });

    if (applications.length > 0) {
      for (const app of applications) {
        app.priority = (app.priority || 0) + 1; // Ensure priority exists
        await app.save();
      }
      console.log(
        `Priority escalated for ${applications.length} application(s).`
      );
    } else {
      console.log("No applications found for priority escalation.");
    }
  } catch (error) {
    console.error("Error during priority escalation:", error);
  }
});

// Scheduler for updating facility status for expired bookings
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Find and update expired bookings in bulk
    const expiredBookings = await Booking.find({
      end_time: { $lte: now },
      approval_status: "approved",
    });

    if (expiredBookings.length > 0) {
      const facilityIds = expiredBookings.map((booking) => booking.facility);

      // Bulk update facilities to 'available'
      await Facility.updateMany(
        { _id: { $in: facilityIds } },
        { status: "available" }
      );

      console.log(
        `Facility status updated for ${expiredBookings.length} expired bookings.`
      );
    } else {
      console.log("No expired bookings found.");
    }
  } catch (error) {
    console.error("Error updating facility status:", error);
  }
});

console.log(
  "Scheduler started: checking for priority escalation and expired bookings every minute."
);
