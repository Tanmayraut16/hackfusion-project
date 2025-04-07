import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Activity, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

const API_URL = "http://localhost:3000/api/budgets/all";

export default function ManageBudget() {
  const [userRole] = useState("faculty");
  const canReview = userRole === "faculty" || userRole === "admin";
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        "http://localhost:3000/api/budgets/update-status",
        { 
          id: id,
          status: status 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      setData((prev) =>
        prev.map((budget) =>
          budget._id === id ? { ...budget, status } : budget
        )
      );

      setError(null);
    } catch (error) {
      console.error(`Failed to update budget status:`, error);
      setError(`Failed to ${status} budget request. Please try again.`);
    }
  };

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
        setError("Failed to fetch budget data. Please try again later.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, []);

  const stats = useMemo(() => {
    return {
      pending: data.filter((budget) => budget.status === "pending").length,
      approved: data.filter((budget) => budget.status === "approved").length,
      rejected: data.filter((budget) => budget.status === "rejected").length,
      highAmount: data.filter((budget) => budget.amount >= 100000).length,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Budget Management Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-medium text-yellow-400">Pending</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium text-green-400">Approved</h3>
            </div>
            <p className="text-3xl font-bold text-green-500">{stats.approved}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-medium text-red-400">Rejected</h3>
            </div>
            <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-medium text-purple-400">High Value</h3>
            </div>
            <p className="text-3xl font-bold text-purple-500">{stats.highAmount}</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-200">Recent Budget Requests</h2>
          
          {data.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No budget requests found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="px-4 py-3 text-left text-gray-400">Title</th>
                    <th className="px-4 py-3 text-left text-gray-400">Category</th>
                    <th className="px-4 py-3 text-left text-gray-400">Amount (₹)</th>
                    <th className="px-4 py-3 text-left text-gray-400">Created By</th>
                    <th className="px-4 py-3 text-left text-gray-400">Status</th>
                    {canReview && <th className="px-4 py-3 text-gray-400">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {data.map((budget) => (
                    <tr key={budget._id} className="group hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3 capitalize">{budget.title}</td>
                      <td className="px-4 py-3 capitalize">{budget.category}</td>
                      <td className={`px-4 py-3 font-medium ${
                        budget.amount >= 100000 ? "text-red-400" : "text-gray-200"
                      }`}>
                        ₹{budget.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {`${budget.allocatedByModel} - (${budget.allocated_by.name})`}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          budget.status === "approved"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : budget.status === "rejected"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}>
                          {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                        </span>
                      </td>
                      {canReview && (
                        <td className="px-4 py-3">
                          {budget.status === "pending" ? (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleAction(budget._id, "approved")}
                                className="px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(budget._id, "rejected")}
                                className="px-4 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              budget.status === "approved"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}