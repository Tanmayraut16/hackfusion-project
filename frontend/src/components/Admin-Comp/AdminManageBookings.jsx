import React, { useState } from "react";
import {
  Building2,
  Bell,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import axios from "axios";

const AdminManageBookings = () => {
  const [facilities, setFacilities] = useState([]);
  const [notifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newFacility = {
      name: formData.get("name"),
      location: formData.get("location"),
      description: formData.get("description"),
      status: formData.get("status") || "available",
    };

    try {
      const token = localStorage.getItem("token"); // Retrieve stored JWT token

      const response = await axios.post(
        "http://localhost:3000/api/facilities",
        newFacility,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request
            "Content-Type": "application/json",
          },
        }
      );

      setFacilities([...facilities, response.data]);

      setShowAddSuccess(true);
      e.currentTarget.reset();
      setTimeout(() => setShowAddSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding facility:", error);
      alert("Failed to add facility. Please check your permissions.");
    }
  };

  const filteredFacilities = facilities.filter((facility) =>
    statusFilter === "all" ? true : facility.status === statusFilter
  );

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "under_maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "request":
        return <Clock className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold">Filter Facilities</h2>
              </div>
              <div className="flex gap-2">
                {["all", "available", "booked", "under_maintenance"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        statusFilter === status
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("_", " ")}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Facilities List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Facilities</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredFacilities.map((facility) => (
                  <div key={facility.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {facility.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {facility.location}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          facility.status
                        )}`}
                      >
                        {facility.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {facility.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Facility Form */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">Add New Facility</h2>
              </div>
              {showAddSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Facility added successfully!
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Facility Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="under_maintenance">Under Maintenance</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add Facility
                </button>
              </form>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                Recent Notifications
              </h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-md"
                  >
                    {getNotificationIcon(notification.type)}
                    <div>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageBookings;
