import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  AlertCircle,
  CheckCircle,
  FileText,
  PenTool as Tools,
  Filter,
  Building2,
  Clock,
} from "lucide-react";

const FacultyFacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
    const interval = setInterval(fetchFacilities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchFacilities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facilities`);
      const data = await response.json();
      setFacilities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
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
          colorClass: "text-emerald-400",
          bgClass: "bg-emerald-500/10",
          borderClass: "border-emerald-500/20",
          iconClass: "text-emerald-500",
        };
      case "booked":
        return {
          icon: Clock,
          text: "Booked",
          colorClass: "text-red-400",
          bgClass: "bg-red-500/10",
          borderClass: "border-red-500/20",
          iconClass: "text-red-500",
        };
      case "under_maintenance":
        return {
          icon: Tools,
          text: "Under Maintenance",
          colorClass: "text-amber-400",
          bgClass: "bg-amber-500/10",
          borderClass: "border-amber-500/20",
          iconClass: "text-amber-500",
        };
      default:
        return {
          icon: AlertCircle,
          text: "Unknown",
          colorClass: "text-gray-400",
          bgClass: "bg-gray-500/10",
          borderClass: "border-gray-500/20",
          iconClass: "text-gray-500",
        };
    }
  };

  return (
    <div className="min-h-screen text-gray-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Faculty Facility Management
                </h1>
                <p className="text-gray-400 mt-1">
                  Monitor and manage facility bookings across campus
                </p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
                const StatusIcon = config.icon;
                return (
                  <div 
                    key={status}
                    className={`flex items-center rounded-full px-4 py-2 ${config.bgClass} border ${config.borderClass}`}
                  >
                    <StatusIcon className={`h-4 w-4 mr-2 ${config.iconClass}`} />
                    <span className={`text-sm font-medium ${config.colorClass}`}>
                      {status.replace("_", " ").charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-800/50 rounded-full animate-pulse">
              <Building2 className="h-12 w-12 text-purple-500" />
            </div>
            <p className="text-gray-300 text-lg mt-4">Loading facilities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility) => {
              const statusConfig = getStatusConfig(facility.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={facility._id}
                  className="group relative overflow-hidden rounded-2xl bg-gray-900/40 backdrop-blur-sm hover:bg-gray-800/40 transition-all duration-500 border border-gray-800/50"
                >
                  {/* Background Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.bgClass} border ${statusConfig.borderClass}`}>
                    <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.iconClass}`} />
                    <span className={statusConfig.colorClass}>{statusConfig.text}</span>
                  </div>
                  
                  <div className="relative p-6 pt-12">
                    <h3 className="text-xl font-bold text-gray-100 mb-4 group-hover:text-purple-400 transition-colors duration-300">
                      {facility.name}
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-blue-500/10 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-400" />
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {facility.location || "Location not specified"}
                        </p>
                      </div>
                      
                      {/* Description */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-purple-500/10 p-2 rounded-lg">
                          <FileText className="h-4 w-4 text-purple-400" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {facility.description || "No description available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredFacilities.length === 0 && !isLoading && (
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
      </main>
    </div>
  );
};

export default FacultyFacilityBooking;