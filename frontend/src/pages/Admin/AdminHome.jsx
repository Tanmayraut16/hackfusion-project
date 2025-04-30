import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AdminDashboard from "../../components/Admin-Comp/AdminDashboard";
import AdminUsers from "../../components/Admin-Comp/AdminUsers";
import AdminElectionsManage from "./AdminElectionManage";
import AdminComplaints from "../../components/Admin-Comp/AdminComplaints";
import AdminManageBookings from "../../components/Admin-Comp/AdminManageBookings";
import AdminSettings from "../../components/Admin-Comp/AdminSettings";

import ManageApplication from "../../components/ManageApplication";
import BudgetComponent from "../../components/Budget";
import ManageBudget from "../../components/Admin-Comp/ManageApproval";
import ExpensesComponent from "../../components/Budget-Comp/Expenses"; // Assuming you want budget detail view

function AdminHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar role="Admin" isOpen={isSidebarOpen} />

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
          userName="Admin"
        />

        {/* Main Section */}
        <div
          className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8 text-gray-100"
          style={{
            height: `calc(100vh - 60px)`,
          }}
        >
          <div className="container mx-auto px-20 py-10">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="elections" element={<AdminElectionsManage />} />
              <Route path="bookings" element={<AdminManageBookings />} />
              <Route path="application" element={<ManageApplication />} />
              <Route path="budget" element={<BudgetComponent />} />
              <Route path="budget/:budgetId" element={<ExpensesComponent />} />
              <Route path="approvals" element={<ManageBudget />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<AdminDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
