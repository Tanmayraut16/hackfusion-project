import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import FacultyDashboard from "../../components/Faculty-Comp/FacultyDashboard";
import FacultyComplaints from "../../components/Faculty-Comp/FacultyComplaints";
import FacultyFacilityBooking from "../../components/Faculty-Comp/FacultyFacilityBooking";
import ReportCheating from "../../components/ReportCheating";
import ManageApplication from "../../components/ManageApplication";
import BudgetComponent from "../../components/Budget";
import ExpensesComponent from "../../components/Budget-Comp/Expenses";

function FacultyHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for Faculty */}
      <Sidebar role="Faculty" isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 transition-all duration-300"
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
          className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8 text-gray-100"
          style={{
            height: `calc(100vh - 60px)`,
          }}
        >
          <div className="container mx-auto px-20 py-10">
            <Routes>
              <Route path="dashboard" element={<FacultyDashboard />} />
              <Route path="complaints" element={<FacultyComplaints />} />
              <Route path="report-cheating" element={<ReportCheating />} />
              <Route path="booking" element={<FacultyFacilityBooking />} />
              <Route path="budget" element={<BudgetComponent />} />
              <Route path="budget/:budgetId" element={<ExpensesComponent />} />
              <Route path="application" element={<ManageApplication />} />
              <Route path="*" element={<FacultyDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyHome;
