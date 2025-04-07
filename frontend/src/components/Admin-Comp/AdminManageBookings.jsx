import React, { useEffect, useState } from "react";
import {
  Building2,
  Bell,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
} from "lucide-react";
import axios from "axios";

const AdminManageBookings = () => {
  const [facilities, setFacilities] = useState([]);
  const [notifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFacilities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/facilities");
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

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
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/facilities", newFacility, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      fetchFacilities();
      setShowAddSuccess(true);
      e.target.reset();

      setTimeout(() => setShowAddSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding facility:", error);
      setErrorMessage("Failed to add facility. Please check your permissions.");
    }
  };

  const filteredFacilities = facilities.filter((facility) =>
    statusFilter === "all" ? true : facility.status === statusFilter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-900/50 text-emerald-400 border border-emerald-500/20";
      case "booked":
        return "bg-blue-900/50 text-blue-400 border border-blue-500/20";
      case "under_maintenance":
        return "bg-amber-900/50 text-amber-400 border border-amber-500/20";
      default:
        return "bg-gray-800 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search facilities..."
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                  {["all", "available", "booked", "under_maintenance"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          statusFilter === status
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).replace("_", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Facilities List */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Facilities</h2>
              </div>
              <div className="divide-y divide-gray-700">
                {filteredFacilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="p-6 hover:bg-gray-700/30 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          {facility.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-400">
                            {facility.location}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                          facility.status
                        )}`}
                      >
                        {facility.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-400">
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
            <div className="bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Plus className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Add New Facility
                </h2>
              </div>

              {showAddSuccess && (
                <div className="mb-6 p-4 bg-emerald-900/50 border border-emerald-500/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Facility added successfully!</span>
                  </div>
                  <button
                    onClick={() => setShowAddSuccess(false)}
                    className="text-emerald-400 hover:text-emerald-300 transition"
                  >
                    ✖
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Facility Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="under_maintenance">Under Maintenance</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 px-4 rounded-lg hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition transform hover:-translate-y-0.5"
                >
                  Add Facility
                </button>
              </form>
            </div>

            {/* Notifications */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Recent Notifications
              </h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50"
                  >
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Bell className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
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