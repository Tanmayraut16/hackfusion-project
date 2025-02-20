import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  AlertCircle,
  CheckCircle,
  PenTool as Tools,
  Filter,
} from "lucide-react";

// const initialFacilities = [
//   {
//     id: "1",
//     name: "Tennis Court",
//     location: "Sports Complex, North Wing",
//     description:
//       "Professional-grade tennis court with night lighting facilities",
//     status: "available",
//     imageUrl:
//       "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     id: "2",
//     name: "Main Auditorium",
//     location: "Academic Block A",
//     description: "State-of-the-art auditorium with 500 seating capacity",
//     status: "booked",
//     imageUrl:
//       "https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     id: "3",
//     name: "Conference Room",
//     location: "Administrative Block, 2nd Floor",
//     description: "Modern conference room with AV equipment",
//     status: "available",
//     imageUrl:
//       "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     id: "4",
//     name: "Basketball Court",
//     location: "Sports Complex, East Wing",
//     description: "Indoor basketball court with spectator seating",
//     status: "under_maintenance",
//     imageUrl:
//       "https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     id: "5",
//     name: "Computer Lab",
//     location: "Technology Block, Ground Floor",
//     description: "50-station computer lab with high-speed internet",
//     status: "available",
//     imageUrl:
//       "https://images.unsplash.com/photo-1598004514854-20aa5c9e9be3?auto=format&fit=crop&q=80&w=800",
//   },
// ];

const StudentFacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/facilities")
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch(() => setFacilities(initialFacilities)); // Fallback to static data if API fails
  }, []);

  const handleBooking = (facility) => {
    setBookingMessage(`You have successfully booked ${facility.name}!`);
    setTimeout(() => setBookingMessage(""), 3000);
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

        {bookingMessage && (
          <div className="mb-6 p-4 bg-green-100 rounded-md">
            <p className="text-green-700">{bookingMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={facility.imageUrl}
                alt={facility.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
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
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <p className="text-sm">{facility.location}</p>
                </div>
                <p className="text-gray-600 mb-6">{facility.description}</p>
                <button
                  onClick={() =>
                    facility.status === "available" && handleBooking(facility)
                  }
                  disabled={facility.status !== "available"}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                    facility.status === "available"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {facility.status === "available"
                    ? "Book Now"
                    : "Not Available"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentFacilityBooking;
