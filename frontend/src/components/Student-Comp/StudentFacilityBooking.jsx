import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  MapPin,
  AlertCircle,
  CheckCircle,
  FileText,
  PenTool as Tools,
  Filter,
  Clock,
  RefreshCw,
} from "lucide-react";
import BookNow from "./BookNow";
import { updateFacilityStatus } from "../../utils/statusUpdater";

const StudentFacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bookedFacilities, setBookedFacilities] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Memoize fetch function to prevent unnecessary recreations
  const fetchFacilities = useCallback(async (showRefreshIndicator = true) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facilities`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const updatedFacilities = data.map((facility) => {
          const bookedData = bookedFacilities[facility._id];
          return bookedData && facility.status === "booked"
            ? { ...facility, ...bookedData }
            : facility;
        });

        setFacilities(updatedFacilities);
        setLastUpdated(new Date());
      } else {
        console.error("API response is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [bookedFacilities]);

  useEffect(() => {
    fetchFacilities(false);
  }, [fetchFacilities]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchFacilities(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchFacilities]);

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
    setLastUpdated(new Date());
  };

  const manualRefresh = () => {
    fetchFacilities(true);
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
          badgeClass: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/20",
          buttonClass:
            "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:scale-[1.02] transition-all duration-300",
        };
      case "booked":
        return {
          icon: Clock,
          text: "Booked",
          badgeClass: "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/20",
          buttonClass: "bg-gray-800/50 text-gray-400 cursor-not-allowed border border-gray-700/50",
        };
      case "under_maintenance":
        return {
          icon: Tools,
          text: "Under Maintenance",
          badgeClass: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/20",
          buttonClass: "bg-gray-800/50 text-gray-400 cursor-not-allowed border border-gray-700/50",
        };
      default:
        return {
          icon: AlertCircle,
          text: "Not Available",
          badgeClass: "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-500/20",
          buttonClass: "bg-gray-800/50 text-gray-400 cursor-not-allowed border border-gray-700/50",
        };
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="min-h-screen text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
                  Facility Booking Portal
                </h1>
                <p className="text-gray-400 mt-3 text-lg">
                  Book facilities for your academic and extracurricular needs
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">
                  Last updated: {formatTime(lastUpdated)}
                </div>
                <button 
                  onClick={manualRefresh}
                  disabled={isRefreshing}
                  className="flex items-center justify-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300 border border-gray-700/50"
                >
                  <RefreshCw className={`h-5 w-5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search facilities by name..."
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-700/50 rounded-xl bg-gray-900/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 placeholder-gray-500 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="lg:col-span-2 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-purple-400" />
                </div>
                <select
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-700/50 rounded-xl bg-gray-900/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 transition-all duration-300 appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Facilities</option>
                  <option value="available">Available Now</option>
                  <option value="booked">Currently Booked</option>
                  <option value="under_maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap gap-3 mt-6">
              {["available", "booked", "under_maintenance"].map(status => {
                const config = getStatusConfig(status);
                return (
                  <div 
                    key={status}
                    className={`flex items-center rounded-full px-4 py-2 ${config.badgeClass}`}
                  >
                    <config.icon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{config.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Facilities Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-800/50 rounded-full">
              <RefreshCw className="h-12 w-12 text-purple-500 animate-spin" />
            </div>
            <p className="text-gray-300 text-lg mt-4">Loading facilities...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFacilities.map((facility) => {
                const statusConfig = getStatusConfig(facility.status);
                const StatusIcon = statusConfig.icon;
                const isAvailable = facility.status === "available";

                return (
                  <div
                    key={facility._id}
                    className="group relative overflow-hidden rounded-2xl bg-gray-900/40 backdrop-blur-sm hover:bg-gray-800/40 transition-all duration-500 border border-gray-800/50"
                  >
                    {/* Background Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Facility Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.badgeClass}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span>{statusConfig.text}</span>
                    </div>
                    
                    <div className="relative p-6 pt-12">
                      <h3 className="text-xl font-bold text-gray-100 mb-4 group-hover:text-purple-400 transition-colors duration-300">
                        {facility.name}
                      </h3>
                      
                      <div className="space-y-4 mb-6">
                        {/* Location */}
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 bg-purple-500/10 p-2 rounded-lg">
                            <MapPin className="h-4 w-4 text-purple-400" />
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {facility.location || "Location not specified"}
                          </p>
                        </div>
                        
                        {/* Description */}
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 bg-blue-500/10 p-2 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-400" />
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {facility.description || "No description available"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Booking Info */}
                      {facility.status === "booked" && facility.bookedBy && (
                        <div className="mb-6 py-3 px-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                          <p className="text-sm text-blue-300">
                            <span className="font-medium">Current booking:</span>
                            <span className="flex items-center gap-2 mt-1.5">
                              <Clock className="h-4 w-4 text-blue-400" />
                              {facility.bookedBy} • {facility.duration}
                            </span>
                          </p>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <button
                        onClick={() => handleBooking(facility)}
                        disabled={!isAvailable}
                        className={`w-full px-4 py-3.5 rounded-xl font-medium ${statusConfig.buttonClass}`}
                      >
                        {isAvailable ? "Book Now" : statusConfig.text}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredFacilities.length === 0 && (
              <div className="text-center py-16 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50">
                <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">
                  No facilities found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
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