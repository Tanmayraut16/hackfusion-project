import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  AlertCircle,
  CheckCircle,
  Users,
  Clock,
  Filter,
} from "lucide-react";

const FacultyFacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [bookingMessage, setBookingMessage] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/facilities")
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch(() => setFacilities([]));
  }, []);

  const handleBooking = (facility) => {
    setSelectedFacility(facility);
    setShowBookingModal(true);
  };

  const filteredFacilities = facilities.filter((facility) => {
    const matchesStatus =
      statusFilter === "all" || facility.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || facility.department === departmentFilter;
    const matchesSearch = facility.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "booked":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "under_maintenance":
        return <span className="w-5 h-5 text-yellow-500">🔧</span>;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Simple Modal Component
  const BookingModal = ({ facility, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Book {facility.name}</h2>
        <div className="mb-4">
          <p className="text-gray-600">Location: {facility.location}</p>
          <p className="text-gray-600">
            Available Hours: {facility.hours || "9:00 AM - 5:00 PM"}
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setBookingMessage(`Successfully booked ${facility.name}`);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Faculty Facility Booking
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and book facilities for academic purposes
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search facilities..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="under_maintenance">Under Maintenance</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="science">Science</option>
              <option value="arts">Arts</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        {/* Booking Message */}
        {bookingMessage && (
          <div className="mb-6 p-4 bg-green-100 rounded-md">
            <p className="text-green-700">{bookingMessage}</p>
          </div>
        )}

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFacilities.map((facility, index) => (
            <div
              key={facility.id || `facility-${index}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Facility Name & Status */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {facility.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(facility.status)}
                    <span
                      className={`text-sm ${
                        facility.status === "available"
                          ? "text-green-500"
                          : facility.status === "booked"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {getStatusText(facility.status)}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-500 mb-3">
                  <MapPin className="h-5 w-5 mr-2" />
                  <p className="text-sm">{facility.location}</p>
                </div>

                {/* Capacity */}
                <div className="flex items-center text-gray-500 mb-3">
                  <Users className="h-5 w-5 mr-2" />
                  <p className="text-sm">
                    Capacity: {facility.capacity || "N/A"}
                  </p>
                </div>

                {/* Available Hours */}
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="h-5 w-5 mr-2" />
                  <p className="text-sm">
                    Hours: {facility.hours || "9:00 AM - 5:00 PM"}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">{facility.description}</p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      facility.status === "available" && handleBooking(facility)
                    }
                    disabled={facility.status !== "available"}
                    className={`w-full px-4 py-2 rounded-md ${
                      facility.status === "available"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {facility.status === "available"
                      ? "Book Now"
                      : "Not Available"}
                  </button>

                  {facility.status === "available" && (
                    <button
                      className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                      onClick={() =>
                        window.open(
                          `/facility-schedule/${facility.id}`,
                          "_blank"
                        )
                      }
                    >
                      View Schedule
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedFacility && (
        <BookingModal
          facility={selectedFacility}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedFacility(null);
          }}
        />
      )}
    </div>
  );
};

export default FacultyFacilityBooking;
