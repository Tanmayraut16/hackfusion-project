import React from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, Clock, BookOpen, UserRound, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { updateFacilityStatus } from "../../utils/statusUpdater";

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-[550px] overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Book {facility.name}</h2>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 mb-6">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-300 font-medium">{facility.name}</p>
                    <p className="text-gray-400 text-sm">{facility.location}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" /> Start Time
                </div>
              </label>
              <input
                type="datetime-local"
                {...register("startTime", {
                  required: "Start time is required",
                })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
              {errors.startTime && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" /> End Time
                </div>
              </label>
              <input
                type="datetime-local"
                {...register("endTime", { required: "End time is required" })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
              {errors.endTime && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-blue-400" /> User Type
              </div>
            </label>
            <select
              {...register("userType", { required: "User type is required" })}  
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select user type</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
            </select>
            {errors.userType && (
              <p className="mt-2 text-sm text-red-400">
                {errors.userType.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-400" /> Reason for Booking
              </div>
            </label>
            <textarea
              {...register("reason", { required: "Reason is required" })}  
              rows={4}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Please provide a reason for your booking..."
            />
            {errors.reason && (
              <p className="mt-2 text-sm text-red-400">
                {errors.reason.message}
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 transform hover:translate-y-1"
            >
              Book Facility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookNow;