import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/applications/all";

export default function ManageApplication() {
  const [userRole] = useState("faculty");
  const canReview = userRole === "faculty" || userRole === "admin";

  const [data, setdata] = useState([]);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = `http://localhost:3000/api/applications/${id}/${action}`;

      await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });

      setdata((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: action === "approve" ? "approved" : "rejected" } : app
        )
      );
    } catch (error) {
      console.error(`Failed to ${action} application:`, error);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setdata(data.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  // Calculate statistics dynamically
  const stats = useMemo(() => {
    return {
      pending: data.filter((app) => app.status === "pending").length,
      approved: data.filter((app) => app.status === "approved").length,
      rejected: data.filter((app) => app.status === "rejected").length,
      highPriority: data.filter((app) => app.priority >= 4).length,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Reviewer Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: "Pending Reviews", 
              count: stats.pending, 
              gradient: "from-yellow-500 to-amber-600",
              icon: "⏳"
            },
            { 
              title: "Approved", 
              count: stats.approved, 
              gradient: "from-green-500 to-emerald-600",
              icon: "✓" 
            },
            { 
              title: "Rejected", 
              count: stats.rejected, 
              gradient: "from-red-500 to-rose-600",
              icon: "✗"
            },
            { 
              title: "High Priority", 
              count: stats.highPriority, 
              gradient: "from-orange-500 to-red-500",
              icon: "⚠️"
            },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold mb-2 text-gray-300">{stat.title}</h2>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.count}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Recent Applications
          </h2>
          
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300">
                  <th className="p-3 text-left">Applicant</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Submitted</th>
                  {canReview && <th className="p-3 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((application, idx) => (
                  <tr 
                    key={application._id} 
                    className={`border-t border-gray-700 ${idx % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'} hover:bg-gray-700/50 transition-colors`}
                  >
                    <td className="p-3">{application.user?.name || "Unknown"}</td>
                    <td className="p-3 capitalize">{application.category}</td>
                    <td className="p-3">
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium
                        ${application.priority >= 4 
                          ? 'bg-gradient-to-r from-red-500 to-red-700 text-white' 
                          : application.priority >= 3 
                            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                        }`}
                      >
                        Level {application.priority}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300">{new Date(application.createdAt).toLocaleDateString()}</td>
                    {canReview && (
                      <td className="p-3 text-center">
                        {application.status === "pending" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAction(application._id, "approve")}
                              className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded hover:from-green-600 hover:to-emerald-700 transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(application._id, "reject")}
                              className="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded hover:from-red-600 hover:to-rose-700 transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded font-medium ${
                              application.status === "approved" 
                                ? "bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-400"
                                : "bg-gradient-to-r from-red-500/20 to-rose-600/20 text-red-400"
                            }`}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}