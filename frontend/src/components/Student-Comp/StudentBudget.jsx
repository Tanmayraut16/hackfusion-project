import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Default import

const API_URL = "http://localhost:3000/api/budgets/all";
const API_URL_ID = "http://localhost:3000/api/budgets/";
const API_URL_ADD = "http://localhost:3000/api/budgets/add";

function ErrorMessage({ message }) {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      role="alert"
    >
      <p>{message}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function BudgetForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "To ",
    category: "event",
    amount: "",
    allocated_by: {
      model: "Faculty", // Changed to match backend expectation
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
      console.log("Decoded Token:", decodedToken); // Debugging step

      const userId = decodedToken?.studentId; // Extracting correct field
      if (!userId) {
        throw new Error("User ID not found in token");
      }

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
          title: "To",
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create New Budget</h2>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter Title"
              value={formData.title}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full p-2 border rounded"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created By
            </label>
            <select
              className="w-full p-2 border rounded"
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
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 border rounded hover:bg-gray-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ExpenseTable({ expenses, isLoading, error }) {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Expense Log</h3>
      {!expenses || expenses.length === 0 ? (
        <p className="text-gray-600">No expenses found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Proof</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="border hover:bg-gray-50">
                <td className="border p-2">
                  {new Date(expense.spent_at).toLocaleDateString()}
                </td>
                <td className="border p-2">{expense.description}</td>
                <td className="border p-2">
                  ₹
                  {expense?.amount_spent
                    ? expense.amount_spent.toFixed(2)
                    : "0.00"}
                </td>

                <td className="border p-2">
                  {expense.proof_url ? (
                    <a
                      href={expense.proof_url}
                      className="text-blue-600 hover:underline flex items-center justify-center cursor-pointer"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">No proof</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function BudgetComponent() {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expensesError, setExpensesError] = useState(null);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);

  const fetchBudgets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      if (response.data.success) {
        setBudgets(response.data.data || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch budgets");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch budgets";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    async function fetchExpenses(budgetId) {
      setIsLoadingExpenses(true);
      setExpensesError(null);

      try {
        if (!budgetId) return;

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        console.log(`Fetching expenses for budget ID: ${budgetId}`);

        const response = await axios.get(`${API_URL_ID}${budgetId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });

        console.log("API Full Response:", response.data);

        const expensesData = response.data?.data?.expenses;
        if (!Array.isArray(expensesData)) {
          throw new Error("Expenses not found in response");
        }

        setExpenses((prev) => ({
          ...prev,
          [budgetId]: expensesData,
        }));
      } catch (error) {
        console.error(
          "Error fetching expenses:",
          error.response?.data || error.message
        );
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch expenses";
        setExpensesError(errorMessage);
      } finally {
        setIsLoadingExpenses(false);
      }
    }

    if (selectedBudget?._id) {
      fetchExpenses(selectedBudget._id);
    }
  }, [selectedBudget]);

  const handleCreateBudget = (newBudget) => {
    setBudgets((prev) => [...prev, newBudget]);
    setIsBudgetDialogOpen(false);
    fetchBudgets(); // Refresh the budgets list after creating a new one
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Budget Management</h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setIsBudgetDialogOpen(true)}
        >
          + Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {budgets.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            No budgets found.
          </p>
        ) : (
          budgets.map((budget) => (
            <div
              key={budget._id}
              className={`bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border 
                ${
                  selectedBudget?._id === budget._id
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-gray-200"
                }`}
              onClick={() => setSelectedBudget(budget)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {budget.title}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full 
                    ${
                      budget.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : budget.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {budget.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Category:{" "}
                <span className="font-medium text-gray-800">
                  {budget.category}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Amount:{" "}
                <span className="font-medium text-gray-800">
                  ${budget.amount}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Created by:{" "}
                <span className="font-medium">
                  {budget.allocated_by?.name ||
                    budget.allocated_by?.model ||
                    "Unknown"}
                </span>
              </p>
            </div>
          ))
        )}
      </div>

      {selectedBudget && (
        <ExpenseTable
          expenses={expenses[selectedBudget._id] || []}
          isLoading={isLoadingExpenses}
          error={expensesError}
        />
      )}

      {isBudgetDialogOpen && (
        <BudgetForm
          onClose={() => setIsBudgetDialogOpen(false)}
          onSubmit={handleCreateBudget}
        />
      )}
    </div>
  );
}
