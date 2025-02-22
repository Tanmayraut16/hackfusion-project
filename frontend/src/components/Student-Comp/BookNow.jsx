import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import axios from "axios";
import toast from "react-hot-toast";

const BookNow = ({ facility, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  console.log(facility)
  const facilityName = facility.name;
  // console.log(facilityName)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      facilityName, // Set the default facility name
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/booking/bookings",
        data,
        {
          headers: { Authorization: `"Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("Booking submitted:", response.data);
      toast.success("Booking request sent");
      setIsOpen(false);
      reset();
      onClose(); // Close the modal properly
    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Booking failed. Try again.");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
    onClose(); // Ensure modal closes
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Book Facility
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Facility Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facility Name
              </label>
              <input
                type="text"
                {...register("facilityName")}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="datetime-local"
                {...register("startTime", { required: "Start time is required" })}
                className={clsx(
                  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                  errors.startTime && "border-red-500"
                )}
                min={new Date().toISOString().slice(0, 16)} // Corrected min value
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="datetime-local"
                {...register("endTime", { required: "End time is required" })}
                className={clsx(
                  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                  errors.endTime && "border-red-500"
                )}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
              )}
            </div>

            {/* Reason for Booking */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason for Booking
              </label>
              <textarea
                {...register("reason", { required: "Reason is required" })}
                className={clsx(
                  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                  errors.reason && "border-red-500"
                )}
                rows={3}
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Type
              </label>
              <select
                {...register("userType", { required: "User type is required" })}
                className={clsx(
                  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
                  errors.userType && "border-red-500"
                )}
              >
                <option value="">Select user type</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Staff">Staff</option>
              </select>
              {errors.userType && (
                <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Booking
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookNow;
