import React from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { updateFacilityStatus } from "../../utils/statusUpdater"; // Importing extracted function

const BookNow = ({ facility, onClose, onBookingSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      facilityName: facility.name,
    },
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      // Save booking details
      const bookingResponse = await fetch(
        "http://localhost:3000/api/booking/bookings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...data,
            facilityId: facility._id,
          }),
        }
      );

      if (!bookingResponse.ok) {
        throw new Error("Booking failed");
      }

      // Calculate booking duration
      const endTime = new Date(data.endTime);
      const now = new Date();
      const durationMs = endTime - now;
      const hours = Math.floor(durationMs / 3600000);
      const minutes = Math.floor((durationMs % 3600000) / 60000);
      const durationStr = `${hours}h ${minutes}m`;

      // Update facility status to "booked" only if booking is successful
      await updateFacilityStatus(facility._id, "booked", token);

      // Call onBookingSuccess with facilityId, bookedBy and duration details
      if (onBookingSuccess) {
        onBookingSuccess(facility._id, data.userType, durationStr);
      }

      console.log("Booking submitted successfully");
      toast.success("Booking request sent successfully");

      reset();
      onClose();

      // Schedule status reset if the end time is in the future
      if (durationMs > 0) {
        setTimeout(async () => {
          try {
            await updateFacilityStatus(facility._id, "available", token);
            console.log("Facility status updated to available");
            toast.success("Facility is now available");
          } catch (error) {
            console.error("Failed to update facility status to available:", error);
            toast.error("Failed to update facility status");
          }
        }, durationMs);
      } else {
        // If end time is in the past, update status immediately
        try {
          await updateFacilityStatus(facility._id, "available", token);
          console.log("Facility status updated immediately to available");
          toast.success("Facility is now available");
        } catch (error) {
          console.error("Failed to update facility status to available:", error);
          toast.error("Failed to update facility status");
        }
      }
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(
        error.message || "Failed to submit booking. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-7 w-7 text-white" />
            <h2 className="text-2xl font-semibold text-white">Book Facility</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facility Name
            </label>
            <input
              type="text"
              {...register("facilityName")}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" /> Start Time
                </div>
              </label>
              <input
                type="datetime-local"
                {...register("startTime", {
                  required: "Start time is required",
                })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900"
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" /> End Time
                </div>
              </label>
              <input
                type="datetime-local"
                {...register("endTime", { required: "End time is required" })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900"
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Type
            </label>
            <select
              {...register("userType", { required: "User type is required" })}  
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 bg-white"
            >
              <option value="">Select user type</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
            </select>
            {errors.userType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.userType.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Booking
            </label>
            <textarea
              {...register("reason", { required: "Reason is required" })}  
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 resize-none"
              placeholder="Please provide a reason for your booking..."
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reason.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookNow;
