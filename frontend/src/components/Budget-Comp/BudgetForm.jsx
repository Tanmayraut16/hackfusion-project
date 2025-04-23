import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL_ADD = `${import.meta.env.VITE_API_URL}/api/budgets/add`;

function BudgetForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "event",
    amount: "",
    allocated_by: {
      model: "Faculty",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.id;
      const userRole = decodedToken?.role;

      if (!userId) throw new Error("User ID not found in token");
      if (userRole !== "faculty")
        throw new Error("Only faculty members can allocate a budget.");

      const submitData = {
        title: formData.title,
        category: formData.category,
        amount: Number(formData.amount),
        allocated_by: userId,
        allocatedByModel: formData.allocated_by.model,
      };

      const response = await axios.post(API_URL_ADD, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      });

      if (response.data.success) {
        onSubmit(response.data.data);
        setFormData({
          title: "",
          category: "event",
          amount: "",
          allocated_by: { model: "Faculty" },
        });
        onClose();
      } else {
        throw new Error(response.data.message || "Failed to create budget");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-400">Create New Budget</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter budget title"
              value={formData.title}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                className="appearance-none w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.category}
                required
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="event">Event</option>
                <option value="department">Department</option>
                <option value="mess">Mess</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Amount <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
              <input
                type="number"
                className="w-full p-3 pl-8 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter amount"
                value={formData.amount}
                required
                min="0"
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Created By <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                className="appearance-none w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.allocated_by.model}
                required
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allocated_by: {
                      ...formData.allocated_by,
                      model: e.target.value,
                    },
                  })
                }
              >
                <option value="Faculty">Faculty</option>
                <option value="Student">Student</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              className="px-5 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-purple-500/30 disabled:bg-purple-800 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Budget"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetForm;