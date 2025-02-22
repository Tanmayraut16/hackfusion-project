import React, { useState } from "react";
import axios from "axios";
import {
  Calendar,
  Mail,
  Hash,
  School,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar"; // Assuming Navbar is imported here

const LeaveApplication = () => {
  const [formData, setFormData] = useState({
    studentEmail: "",
    registrationNumber: "",
    studentYear: "",
    parentEmail: "",
    fromDate: "",
    toDate: "",
    reason: "",
    reportedByDoctor: true,
    leftCampus: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic validation
    const requiredFields = [
      "studentEmail",
      "registrationNumber",
      "studentYear",
      "fromDate",
      "toDate",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/doctor/allocateleave",
        {
          email: formData.studentEmail,
          registrationNo: formData.registrationNumber,
          studentYear: formData.studentYear,
          parentEmail: formData.parentEmail,
          fromDate: formData.fromDate,
          toDate: formData.toDate,
          reason: formData.reason,
          reportedByDoctor: formData.reportedByDoctor,
          leftCampus: formData.leftCampus,
        }
      );

      if (response.status === 200) {
        setSuccess(true);

        // Reset form
        setFormData({
          studentEmail: "",
          registrationNumber: "",
          studentYear: "",
          parentEmail: "",
          fromDate: "",
          toDate: "",
          reason: "",
          reportedByDoctor: true,
          leftCampus: true,
        });
      } else {
        throw new Error("Failed to allocate leave. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to allocate leave. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for Students */}
      <Sidebar role="Docter" isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-r from-blue-50 via-blue-30 to-blue-20">
        {/* Navbar */}
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userName="Docter"
        />
        <div className="max-w-4xl m-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
                Student Leave Allocation
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-100 rounded-lg flex items-center gap-3 text-red-700 border border-red-300 shadow-sm">
                  <AlertCircle className="h-6 w-6" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-100 rounded-lg flex items-center gap-3 text-green-700 border border-green-300 shadow-sm">
                  <CheckCircle2 className="h-6 w-6" />
                  <p>Leave allocated and notifications sent successfully.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className=" space-y-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="studentEmail"
                        value={formData.studentEmail}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-12"
                        placeholder="student@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-12"
                        placeholder="e.g., 2021CS001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Year *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <School className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="studentYear"
                        value={formData.studentYear}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-12"
                      >
                        <option value="">Select Year</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-12"
                        placeholder="parent@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-12"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows={4}
                      className="pl-10 block w-full rounded-lg border border-gray-300 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter the reason for leave..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="reportedByDoctor"
                      checked={formData.reportedByDoctor}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Reported by Doctor
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="leftCampus"
                      checked={formData.leftCampus}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Left Campus
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-6 w-6 mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Allocate Leave"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;
