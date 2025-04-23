import React, { useState } from "react";
import axios from "axios";

function ExpenseForm({ budget, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    description: "",
    amount_spent: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.description || !formData.amount_spent || !formData.file) {
      setError("All fields, including proof file, are required.");
      setIsSubmitting(false);
      return;
    }

    if (Number(formData.amount_spent) > budget.amount) {
      setError("Expense amount cannot exceed the allocated budget.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description);
      formDataToSend.append("amount_spent", formData.amount_spent);
      formDataToSend.append("file", formData.file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/budgets/${budget._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        onSubmit(response.data.data);
        setFormData({ description: "", amount_spent: "", file: null });
        onClose();
      } else {
        throw new Error(response.data.message || "Failed to add expense");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || error.message || "Failed to add expense"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Add Expense - {budget.category}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description*
            </label>
            <input
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount Spent* <span className="text-gray-400">(Available: ₹{budget.amount})</span>
            </label>
            <input
              type="number"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
              value={formData.amount_spent}
              onChange={(e) =>
                setFormData({ ...formData, amount_spent: e.target.value })
              }
              required
              min="0"
              max={budget.amount}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Upload Proof*
            </label>
            <div className="relative">
              <input
                type="file"
                className="w-full p-2 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 bg-gray-800 border border-gray-700 rounded-md"
                onChange={handleFileChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 border border-gray-700"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </div>
              ) : (
                "Add Expense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;