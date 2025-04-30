import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart3,
  Wallet,
  PlusCircle,
  Filter,
  Calendar,
  Building2,
  Coffee,
  ChevronRight,
  AlertCircle,
  Loader2,
  Eye
} from "lucide-react";
import BudgetForm from "./Budget-Comp/BudgetForm";

const API_URL = `${import.meta.env.VITE_API_URL}/api/budgets/all`;
const API_URL_ADD = `${import.meta.env.VITE_API_URL}/api/budgets/add`;

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
      <p className="text-purple-200">Loading your budgets...</p>
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

export default function BudgetComponent() {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [budgets, setBudgets] = useState([]);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

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

  const handleCreateBudget = (newBudget) => {
    setBudgets((prev) => [...prev, newBudget]);
    setIsBudgetDialogOpen(false);
    fetchBudgets();
  };

  const handleViewExpenses = (budget) => {
    navigate(`${location}/${budget._id}`);
  };

  const filteredBudgets =
    filterCategory === "all"
      ? budgets
      : budgets.filter((budget) => budget.category === filterCategory);

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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Budget Management
            </h1>
            <p className="text-gray-400 mt-2">
              Track and manage your organization's budgets
            </p>
          </div>
          <button
            onClick={() => setIsBudgetDialogOpen(true)}
            className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Budget</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-8 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-medium text-white">
              Filter by Category
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "all", label: "All Budgets", icon: Wallet },
              { id: "event", label: "Events", icon: Calendar },
              { id: "department", label: "Department", icon: Building2 },
              { id: "mess", label: "Mess", icon: Coffee },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFilterCategory(id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    filterCategory === id
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBudgets.length === 0 ? (
            <div className="col-span-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                No Budgets Found
              </h3>
              <p className="text-gray-400 mb-6">
                Start by creating your first budget in this category
              </p>
              <button
                onClick={() => setIsBudgetDialogOpen(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all inline-flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Budget</span>
              </button>
            </div>
          ) : (
            filteredBudgets.map((budget) => (
              <div
                key={budget._id}
                className={`
                  group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 cursor-pointer
                  hover:bg-gray-800/70 hover:shadow-lg hover:shadow-purple-500/5 border-gray-700/50 hover:border-gray-600/50
                `}
                onClick={() => handleViewExpenses(budget)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <CategoryIcon
                        category={budget.category}
                        className="w-6 h-6 text-purple-400"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white truncate max-w-[180px]">
                        {budget.title}
                      </h3>
                      <p className="text-sm text-gray-400 capitalize">
                        {budget.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      budget.status
                    )}`}
                  >
                    {budget.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Budget</span>
                    <span className="text-lg font-semibold text-white">
                      ${budget.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Used: $4,500</span>
                    <span className="text-emerald-400">Available: $3,500</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Created by:{" "}
                    <span className="text-gray-300">
                      {budget.allocated_by?.name ||
                        budget.allocated_by?.email ||
                        "Unknown"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handleViewExpenses(budget);
                    }}
                    className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View expenses</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Budget Form Modal */}
      {isBudgetDialogOpen && (
        <BudgetForm
          onClose={() => setIsBudgetDialogOpen(false)}
          onSubmit={handleCreateBudget}
        />
      )}
    </div>
  );
}