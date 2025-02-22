import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  AlertCircle,
  CheckCircle,
  PenTool as Tools,
  Filter,
} from "lucide-react";
import BookNow from "./BookNow";
import { updateFacilityStatus } from "../../utils/statusUpdater"; // Import the function

const StudentFacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingMessage, setBookingMessage] = useState("");
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    // Fetch facilities initially
    fetchFacilities();

    // Set interval to refresh facilities every 60 seconds
    const interval = setInterval(() => {
      console.log("Refreshing facilities...");
      fetchFacilities();
    }, 30000); // 60 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/facilities");
      const data = await response.json();

      if (Array.isArray(data)) {
        setFacilities(data);
      } else {
        console.error("API response is not an array:", data);
        setFacilities([]); // Ensure it's always an array
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setFacilities([]); // Prevents `map` errors
    }
  };

  // Handle facility booking
  const handleBooking = (facility) => {
    if (facility.status !== "available") return;
    setSelectedFacility(facility);
  };

  // Update facility status after successful booking
  const handleBookingSuccess = (facilityId) => {
    updateFacilityStatus(facilityId, "booked", (updatedFacilities) => {
      setFacilities(updatedFacilities);
    });

    setTimeout(() => setBookingMessage(""), 3000);
    setSelectedFacility(null);
  };

  // Filter facilities based on search and status
  const filteredFacilities = facilities.filter(
    (facility) =>
      (statusFilter === "all" || facility.status === statusFilter) &&
      facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get button text and styles based on facility status
  const getButtonProps = (status) => {
    switch (status) {
      case "available":
        return {
          text: "Book Now",
          className: "bg-blue-600 text-white hover:bg-blue-700",
        };
      case "booked":
        return {
          text: "Booked",
          className: "bg-gray-200 text-gray-400 cursor-not-allowed",
        };
      case "under_maintenance":
        return {
          text: "Under Maintenance",
          className: "bg-yellow-100 text-yellow-700 cursor-not-allowed",
        };
      default:
        return {
          text: "Not Available",
          className: "bg-gray-200 text-gray-400 cursor-not-allowed",
        };
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search facilities..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="under_maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>

        {/* Booking Message */}
        {bookingMessage && (
          <div className="mb-6 p-4 bg-green-100 rounded-md">
            <p className="text-green-700">{bookingMessage}</p>
          </div>
        )}

        {/* Facilities List */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFacilities.map((facility) => (
            <div
              key={facility._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Facility Name & Status */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {facility.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {facility.status === "available" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {facility.status === "booked" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    {facility.status === "under_maintenance" && (
                      <Tools className="w-5 h-5 text-yellow-500" />
                    )}
                    <span
                      className={`text-sm capitalize ${
                        facility.status === "available"
                          ? "text-green-500"
                          : facility.status === "booked"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {facility.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <p className="text-sm">{facility.location}</p>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">{facility.description}</p>

                {/* Booking Button */}
                <button
                  onClick={() => handleBooking(facility)}
                  disabled={facility.status !== "available"}
                  className={`w-full px-4 py-2 rounded-md transition ${
                    getButtonProps(facility.status).className
                  }`}
                >
                  {getButtonProps(facility.status).text}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Booking Modal */}
      {selectedFacility && (
        <BookNow
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* {bookingMessage && <p>{bookingMessage}</p>} */}
    </div>
  );
};

export default StudentFacilityBooking;
