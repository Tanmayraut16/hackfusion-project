import cron from 'node-cron';
import Application from './models/application.model.js';
import Booking from './models/booking.model.js';
import Facility from './models/facility.model.js';

// Scheduler for Application Priority Escalation
cron.schedule('* * * * *', async () => {
  try {
    console.log('Priority escalation task running at', new Date().toISOString());
    const ESCALATION_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour
    const thresholdTime = new Date(Date.now() - ESCALATION_THRESHOLD_MS);
    
    // Find pending applications created before the threshold time
    const applications = await Application.find({
      status: 'pending',
      created_at: { $lte: thresholdTime }
    });

    if (applications.length > 0) {
      for (const app of applications) {
        app.priority += 1;
        await app.save();
      }
      console.log(`Priority escalated for ${applications.length} application(s).`);
    } else {
      console.log('No applications found for priority escalation.');
    }
  } catch (error) {
    console.error('Error during priority escalation:', error);
  }
});

// Scheduler for updating facility status for expired bookings
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    
    // Find approved bookings that have passed their end_time
    const expiredBookings = await Booking.find({
      end_time: { $lte: now },
      approval_status: 'approved'
    });

    for (const booking of expiredBookings) {
      // Update the facility's status to 'available'
      await Facility.findByIdAndUpdate(booking.facility, { status: 'available' });
      
      // Optionally, update the booking to mark it as processed or archive it.
    }
    console.log('Facility status updated for expired bookings.');
  } catch (error) {
    console.error('Error updating facility status:', error);
  }
});

console.log('Scheduler started: checking for priority escalation and expired bookings every minute.');
