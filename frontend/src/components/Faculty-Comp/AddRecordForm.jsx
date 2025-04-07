import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddRecordForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    examName: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Get token from storage
      const response = await axios.post(
        "http://localhost:3000/api/cheating/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in request
          },
        }
      );

      alert("Cheating record added successfully!");
      setFormData({ registrationNumber: "", examName: "", reason: "" });
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add cheating record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg max-w-2xl w-full p-6 border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Add New Violation Record
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-purple-400 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Registration Number</label>
            <input
              type="text"
              required
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
              placeholder="e.g., CS2021001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Exam Name</label>
            <input
              type="text"
              required
              value={formData.examName}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
              placeholder="e.g., Data Structures"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Reason</label>
            <input
              type="text"
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
              placeholder="Brief description of violation"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
            >
              {loading ? "Submitting..." : "Submit Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordForm;