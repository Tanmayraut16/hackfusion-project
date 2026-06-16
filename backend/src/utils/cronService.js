import cron from 'node-cron';
import Facility from '../models/facility.model.js';
import Booking from '../models/booking.model.js';

const initCronJobs = () => {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // 1. Find all facilities currently marked as 'booked'
      const bookedFacilities = await Facility.find({ status: 'booked' });

      for (const facility of bookedFacilities) {
        // 2. Find the most recent approved booking for this facility
        const activeBooking = await Booking.findOne({
          facility: facility._id,
          approval_status: 'approved',
          end_time: { $gt: now } // Still in the future
        });

        // 3. If no active booking is found, the time has expired
        if (!activeBooking) {
          await Facility.findByIdAndUpdate(facility._id, { status: 'available' });
          console.log(`System: ${facility.name} has been reset to available.`);
        }
      }
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });
};

export default initCronJobs;