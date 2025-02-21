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

const StudentFacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingMessage, setBookingMessage] = useState("");
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/facilities")
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch(() => setFacilities(initialFacilities)); // Fallback to static data if API fails
  }, []);

  const handleBooking = (facility) => {
    console.log(facility);
    setSelectedFacility(facility);
  };

  const filteredFacilities = facilities.filter((facility) => {
    return (
      (statusFilter === "all" || facility.status === statusFilter) &&
      facility.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "booked":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "under_maintenance":
        return <Tools className="w-5 h-5 text-yellow-500" />;
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

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
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
          {filteredFacilities.map((facility, index) => (
            <div
              key={facility.id || `facility-${index}`} // Ensures a unique key
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
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <p className="text-sm">{facility.location}</p>
                </div>
  
                {/* Description */}
                <p className="text-gray-600 mb-6">{facility.description}</p>
  
                {/* Booking Button */}
                <button
                onClick={() => facility.status === "available" && handleBooking(facility)}
                disabled={facility.status !== "available"}
                className={`w-full px-4 py-2 rounded-md ${
                  facility.status === "available"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {facility.status === "available" ? "Book Now" : "Not Available"}
              </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {selectedFacility && (
      <BookNow
        facility={selectedFacility}
        onClose={() => setSelectedFacility(null)} // Close function
      />
    )}
    </div>
  );  
};

export default StudentFacilityBooking;
