import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StudentDashboard from "../../components/Student-Comp/StudentDashboard";
import StudentElections from "./StudentElections";
import StudentFacilityBooking from "../../components/Student-Comp/StudentFacilityBooking";
import StudentComplaints from "../../components/Student-Comp/StudentComplaints";
import ReportCheating from "../../components/ReportCheating";
import ApplicationsPage from "../../components/Student-Comp/StudentApplication";
import BudgetComponent from "../../components/Budget";
import ExpensesComponent from "../../components/Budget-Comp/Expenses";
import { useState } from "react";

function StudentHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="Student" isOpen={isSidebarOpen} />
      <div
        className="flex-1 flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 transition-all duration-300"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "0px",
          width: `calc(100% - ${isSidebarOpen ? "250px" : "0px"})`,
        }}
      >
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userName="Tanmay"
        />
        <div
          className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8 text-gray-100"
          style={{ height: `calc(100vh - 60px)` }}
        >
          <div className="container mx-auto px-6 py-8 lg:px-12">
            <Routes>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="elections" element={<StudentElections />} />
              <Route path="booking" element={<StudentFacilityBooking />} />
              <Route path="report-cheating" element={<ReportCheating />} />
              <Route path="complaints" element={<StudentComplaints />} />
              <Route path="application" element={<ApplicationsPage />} />
              <Route path="budget" element={<BudgetComponent />} />
              <Route path="budget/:budgetId" element={<ExpensesComponent />} />
              <Route path="*" element={<StudentDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
