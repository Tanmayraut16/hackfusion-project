import React, { useState } from "react";
import {
  Calendar,
  Mail,
  Hash,
  School,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const requiredFields = [
      "studentEmail",
      "registrationNumber",
      "studentYear",
      "fromDate",
      "toDate",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to allocate leave. Please try again.");
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

  const InputField = ({ icon: Icon, label, name, type = "text", required, ...props }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="pl-10 block w-full rounded-lg border border-gray-700 bg-gray-800/50
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                   hover:border-gray-600 transition-all duration-200
                   text-gray-100 text-sm h-12"
          {...props}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="px-8 py-12">
          <div className="text-center pb-8 border-b border-gray-700">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Student Leave Application
            </h1>
            <p className="mt-2 text-gray-400">
              Please fill in the required information to submit your leave request
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 rounded-lg flex items-center gap-3 
                          text-red-400 border border-red-800/50">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-900/20 rounded-lg flex items-center gap-3 
                          text-green-400 border border-green-800/50">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p>Leave application submitted successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InputField
                icon={Mail}
                label="Student Email"
                name="studentEmail"
                type="email"
                required
                placeholder="student@example.com"
              />

              <InputField
                icon={Hash}
                label="Registration Number"
                name="registrationNumber"
                required
                placeholder="e.g., 2021CS001"
              />

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  Student Year
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <School className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    name="studentYear"
                    value={formData.studentYear}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-gray-700 bg-gray-800/50
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                             hover:border-gray-600 transition-all duration-200
                             text-gray-100 text-sm h-12"
                  >
                    <option value="">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </select>
                </div>
              </div>

              <InputField
                icon={Mail}
                label="Parent Email"
                name="parentEmail"
                type="email"
                placeholder="parent@example.com"
              />

              <InputField
                icon={Calendar}
                label="From Date"
                name="fromDate"
                type="date"
                required
              />

              <InputField
                icon={Calendar}
                label="To Date"
                name="toDate"
                type="date"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                Reason
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className="pl-10 block w-full rounded-lg border border-gray-700 bg-gray-800/50
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                           hover:border-gray-600 transition-all duration-200
                           text-gray-100 text-sm"
                  placeholder="Enter the reason for leave..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="reportedByDoctor"
                  checked={formData.reportedByDoctor}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-600 bg-gray-800/50 text-blue-500 
                           focus:ring-blue-500 focus:ring-offset-gray-900 cursor-pointer"
                />
                <span className="text-sm text-gray-300">Reported by Doctor</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="leftCampus"
                  checked={formData.leftCampus}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-600 bg-gray-800/50 text-blue-500 
                           focus:ring-blue-500 focus:ring-offset-gray-900 cursor-pointer"
                />
                <span className="text-sm text-gray-300">Left Campus</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-6 rounded-lg
                       text-white bg-gradient-to-r from-blue-500 to-blue-600 
                       hover:from-blue-600 hover:to-blue-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                "Submit Leave Application"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;