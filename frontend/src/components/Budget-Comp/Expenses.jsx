import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Receipt,
  PlusCircle,
  Calendar,
  Building2,
  Coffee,
  Wallet,
  Loader2,
  AlertCircle,
  Download,
  Printer,
  Filter,
} from "lucide-react";
import ExpenseTable from "./ExpenseTable";
import ExpenseForm from "./ExpenseForm";

const API_URL_ID = `${import.meta.env.VITE_API_URL}/api/budgets/`;

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <p className="text-red-200">{message}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      <p className="text-purple-200">Loading budget details...</p>
    </div>
  );
}

const CategoryIcon = ({ category, className }) => {
  switch (category) {
    case "event":
      return <Calendar className={className} />;
    case "department":
      return <Building2 className={className} />;
    case "mess":
      return <Coffee className={className} />;
    default:
      return <Wallet className={className} />;
  }
};

export default function Expenses() {
  const { budgetId } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState("all");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  //   console.log(`Fetching budget details for ID: ${budgetId}`);
  useEffect(() => {
    const fetchBudgetDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(`${API_URL_ID}${budgetId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });

        if (response.data.success) {
          setBudget(response.data.data);
          setExpenses(response.data.data.expenses || []);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch budget details"
          );
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch budget details";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (budgetId) {
      fetchBudgetDetails();
    }
  }, [budgetId]);

  const handleAddExpense = async (newExpense) => {
    try {
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      setIsExpenseDialogOpen(false);

      // Refetch expenses to get the updated list from server
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL_ID}${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      if (response.data.success) {
        setExpenses(response.data.data.expenses || []);
      }
    } catch (error) {
      console.error("Error updating expenses:", error);
    }
  };

  const handleExportCSV = () => {
    if (!filteredExpenses || filteredExpenses.length === 0) return;

    const headers = [
      "Description",
      "Amount Spent",
      "Spent At",
      "Paid By",
      "Status",
    ];
    const rows = filteredExpenses.map((expense) => {
      return [
        `"${expense.description || ""}"`,
        expense.amount_spent || 0,
        new Date(expense.spent_at).toLocaleDateString(),
        expense.paid_by?.name || expense.paid_by?.email || "Unknown",
        expense.status || "N/A",
      ];
    });

    const csvContent = [
      `Budget: ${budget?.title || "Untitled Budget"}`,
      `Category: ${budget?.category || "N/A"}`,
      `Total Budget: ${budget?.amount || 0}`,
      `Used: ${totalExpensesAmount}`,
      `Available: ${availableAmount}`,
      `Date: ${new Date().toLocaleDateString()}`,
      "",
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${budget?.title?.replace(/\s+/g, "_") || "expenses"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  // Calculate total expenses
  const totalExpensesAmount = expenses.reduce(
    (total, expense) => total + (expense.amount_spent || 0),
    0
  );

  // Calculate available amount
  const availableAmount = budget?.amount
    ? budget.amount - totalExpensesAmount
    : 0;

  // Calculate usage percentage
  const usagePercentage = budget?.amount
    ? Math.min(100, Math.round((totalExpensesAmount / budget.amount) * 100))
    : 0;

  // Filter expenses by month if not "all"
  const filteredExpenses =
    filterMonth === "all"
      ? expenses
      : expenses.filter((expense) => {
          const expenseDate = new Date(expense.spent_at);
          return expenseDate.getMonth() === parseInt(filterMonth);
        });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Budgets</span>
          </button>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <CategoryIcon
                    category={budget?.category}
                    className="w-8 h-8 text-purple-400"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {budget?.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      Budget: ${budget?.amount.toLocaleString() || 0}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400 capitalize">
                      Category: {budget?.category || "Unknown"}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        budget?.status
                      )}`}
                    >
                      {budget?.status}
                    </span>
                  </div>
                </div>
              </div>
              {(userRole === "admin" || userRole === "faculty") && (
                <button
                  onClick={() => setIsExpenseDialogOpen(true)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Add Expense</span>
                </button>
              )}
            </div>

            {/* Budget progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      usagePercentage > 90 ? "bg-red-500" : "bg-purple-500"
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6">
                <div className="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-1">Used Budget</div>
                  <div className="text-xl font-semibold text-white">
                    ${totalExpensesAmount.toLocaleString()}
                  </div>
                </div>

                <div className="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-1">Available</div>
                  <div
                    className={`text-xl font-semibold ${
                      availableAmount < 0 ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    ${availableAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Created by info */}
            <div className="text-sm text-gray-400 border-t border-gray-700/50 pt-4">
              Created by:{" "}
              <span className="text-gray-300">
                {budget?.allocated_by?.name ||
                  budget?.allocated_by?.email ||
                  "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Expense filtering */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-8 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-medium text-white">Filter by Month</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterMonth("all")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                ${
                  filterMonth === "all"
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50"
                }
              `}
            >
              All Months
            </button>
            {[
              { id: "0", label: "January" },
              { id: "1", label: "February" },
              { id: "2", label: "March" },
              { id: "3", label: "April" },
              { id: "4", label: "May" },
              { id: "5", label: "June" },
              { id: "6", label: "July" },
              { id: "7", label: "August" },
              { id: "8", label: "September" },
              { id: "9", label: "October" },
              { id: "10", label: "November" },
              { id: "11", label: "December" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilterMonth(id)}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    filterMonth === id
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50"
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Receipt className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Expense Log
                </h3>
                <p className="text-sm text-gray-400">
                  {filteredExpenses.length} expense
                  {filteredExpenses.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <ExpenseTable
            expenses={filteredExpenses}
            isLoading={false}
            error={null}
          />
        </div>
      </div>

      {/* Add expense modal */}
      {isExpenseDialogOpen && (
        <ExpenseForm
          budgetId={budgetId}
          onClose={() => setIsExpenseDialogOpen(false)}
          onSubmit={handleAddExpense}
        />
      )}
    </div>
  );
}
