import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import DoctorDashboard from "./DocterDashboard";
import LeaveApplication from "./LeaveApplication";

function DoctorHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  let lastPart = location.pathname.split("/").pop();
  // logic for not giving an page not found after reaching at home
  if (lastPart == "") {
    lastPart = "dashboard";
  }

  let ContentComponent;
  switch (lastPart) {
    case "dashboard":
      ContentComponent = <DoctorDashboard />;
      break;
    case "leave-application":
      ContentComponent = <LeaveApplication />;
      break;
    default:
      ContentComponent = (
        <p className="text-center text-gray-600">Page not found</p>
      );
      break;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar role="Doctor" isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col bg-gradient-to-r from-blue-50 via-blue-30 to-blue-20 transition-all"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "0px",
          width: `calc(100% - ${isSidebarOpen ? "250px" : "0px"})`,
        }}
      >
        {/* Navbar */}
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userName="Doctor"
        />

        {/* Main Section with Dynamic Content */}
        <div
          className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8 text-gray-100"
          style={{
            height: `calc(100vh - 60px)`,
          }}
        >
          <div className="container mx-auto px-20 py-10">
            {ContentComponent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorHome;
