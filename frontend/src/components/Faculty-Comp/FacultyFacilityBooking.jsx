import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  AlertCircle,
  CheckCircle,
  FileText,
  PenTool as Tools,
  Filter,
} from "lucide-react";

const FacultyFacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchFacilities();
    const interval = setInterval(fetchFacilities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/facilities");
      const data = await response.json();
      setFacilities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setFacilities([]);
    }
  };

  const filteredFacilities = facilities.filter(
    (facility) =>
      (statusFilter === "all" || facility.status === statusFilter) &&
      facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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

        {/* Facilities List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FacultyFacilityBooking;
