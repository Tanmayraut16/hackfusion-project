import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StudentDashboard from "../../components/Student-Comp/StudentDashboard";
import StudentElections from "./StudentElections";
import StudentFacilityBooking from "../../components/Student-Comp/StudentFacilityBooking";
import StudentComplaints from "../../components/Student-Comp/StudentComplaints";
import ReportCheating from "../../components/ReportCheating";
import ApplicationsPage from "../../components/Student-Comp/StudentApplication";


function StudentHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const lastPart = location.pathname.split("/").pop();

  let ContentComponent;
  switch (lastPart) {
    case "dashboard":
      ContentComponent = <StudentDashboard />;
      break;
    case "elections":
      ContentComponent = <StudentElections />;
      break;
    case "booking":
      ContentComponent = <StudentFacilityBooking />;
      break;
    case "report-cheating":
      ContentComponent = <ReportCheating />;
      break;
    case "complaints":
      ContentComponent = <StudentComplaints />;
      break;
    case "application":
      ContentComponent=<ApplicationsPage/>
      break;
    
    default:
      ContentComponent = <StudentDashboard />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for Students */}
      <Sidebar role="Student" isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col bg-gradient-to-r from-blue-50 via-blue-30 to-blue-20"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "0px",
          width: `calc(100% - ${isSidebarOpen ? "250px" : "0px"})`,
        }}
      >
        {/* Navbar */}
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userName="Tanmay"
        />

        {/* Main Section with Dynamic Content */}
        <div
          className="flex-1 bg-gradient-to-br from-green-50 to-green-100 px-4 py-8"
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

export default StudentHome;
