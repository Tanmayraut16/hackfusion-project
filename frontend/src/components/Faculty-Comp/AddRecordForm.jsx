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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Violation Record</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
            <input
              type="text"
              required
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., CS2021001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
            <input
              type="text"
              required
              value={formData.examName}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Data Structures"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <input
              type="text"
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of violation"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
