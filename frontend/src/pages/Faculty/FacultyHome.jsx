import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import FacultyDashboard from "../../components/Faculty-Comp/FacultyDashboard";
import FacultyComplaints from "../../components/Faculty-Comp/FacultyComplaints";
import FacultyFacilityBooking from "../../components/Faculty-Comp/FacultyFacilityBooking";
import ReportCheating from "../../components/ReportCheating";

function FacultyHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const lastPart = location.pathname.split("/").pop();

  let ContentComponent;
  switch (lastPart) {
    case "dashboard":
      ContentComponent = <FacultyDashboard />;
      break;
    case "complaints":
      ContentComponent = <FacultyComplaints />;
      break;
    case "report-cheating":
      ContentComponent = <ReportCheating />;
      break;
    case "booking":
      ContentComponent = <FacultyFacilityBooking />;
      break;
    default:
      ContentComponent = <FacultyDashboard />;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar for Faculty */}
      <Sidebar 
        role="Faculty"
        isOpen={isSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-r from-purple-50 via-purple-30 to-purple-20"
        style={{
          marginLeft: isSidebarOpen ? '250px' : '0px',
          width: `calc(100% - ${isSidebarOpen ? '250px' : '0px'})`
        }}
      >
        {/* Navbar */}
        <Navbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          userName="Tanmay"
        />
        
        {/* Main Section with Dynamic Content */}
        <div 
          className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-8"
          style={{
            height: `calc(100vh - 60px)`
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

export default FacultyHome;
