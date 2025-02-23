import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  AlertCircle,
  CheckCircle,
  FileText,
  PenTool as Tools,
  Filter,
  Clock,
  Users,
  Building2,
} from "lucide-react";
import BookNow from "./BookNow";
import { updateFacilityStatus } from "../../utils/statusUpdater";

const StudentFacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingMessage, setBookingMessage] = useState("");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bookedFacilities, setBookedFacilities] = useState({});

  useEffect(() => {
    fetchFacilities();
    const interval = setInterval(() => {
      console.log("Refreshing facilities...");
      fetchFacilities();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/facilities");
      const data = await response.json();

      if (Array.isArray(data)) {
        const updatedFacilities = data.map((facility) => {
          const bookedData = bookedFacilities[facility._id];
          return bookedData && facility.status === "booked"
            ? { ...facility, ...bookedData }
            : facility;
        });

        setFacilities(updatedFacilities);
      } else {
        console.error("API response is not an array:", data);
        setFacilities([]);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setFacilities([]);
    }
  };

  const handleBooking = (facility) => {
    if (facility.status !== "available") return;
    setSelectedFacility(facility);
  };

  const handleBookingSuccess = (facilityId, userType, duration) => {
    setBookedFacilities((prev) => ({
      ...prev,
      [facilityId]: { bookedBy: userType, duration },
    }));

    setFacilities((prevFacilities) =>
      prevFacilities.map((facility) =>
        facility._id === facilityId
          ? { ...facility, status: "booked", bookedBy: userType, duration }
          : facility
      )
    );

    setSelectedFacility(null);
  };

  const filteredFacilities = facilities.filter(
    (facility) =>
      (statusFilter === "all" || facility.status === statusFilter) &&
      facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case "available":
        return {
          icon: CheckCircle,
          text: "Available",
          className: "text-green-600 bg-green-50",
          buttonClass:
            "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all duration-200",
        };
      case "booked":
        return {
          icon: Clock,
          text: "Booked",
          className: "text-blue-600 bg-blue-50",
          buttonClass: "bg-gray-200 text-gray-400 cursor-not-allowed",
        };
      case "under_maintenance":
        return {
          icon: Tools,
          text: "Under Maintenance",
          className: "text-yellow-600 bg-yellow-50",
          buttonClass: "bg-yellow-100 text-yellow-700 cursor-not-allowed",
        };
      default:
        return {
          icon: AlertCircle,
          text: "Not Available",
          className: "text-gray-600 bg-gray-50",
          buttonClass: "bg-gray-200 text-gray-400 cursor-not-allowed",
        };
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between bg-white p-6 rounded-xl shadow-sm">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search facilities..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFacilities.map((facility) => {
            const statusConfig = getStatusConfig(facility.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={facility._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="relative">
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full ${statusConfig.className} flex items-center space-x-1`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {statusConfig.text}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {facility.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {/* Location */}
                    <p className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <MapPin className="h-5 w-5  text-blue-500 mr-1" />
                      {facility.location || "No location available"}
                    </p>

                    {/* Description */}
                    <p className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <FileText className="h-6 w-6 text-green-500 mr-1" />
                      {facility.description || "No description available"}
                    </p>
                  </div>

                  {facility.status === "booked" && facility.bookedBy && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <span className="font-semibold">Currently booked:</span>
                        <br />
                        {facility.bookedBy} • {facility.duration}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleBooking(facility)}
                    disabled={facility.status !== "available"}
                    className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${statusConfig.buttonClass}`}
                  >
                    {facility.status === "available"
                      ? "Book Now"
                      : statusConfig.text}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No facilities found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {selectedFacility && (
        <BookNow
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default StudentFacilityBooking;
