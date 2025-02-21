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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Reviewer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Pending Reviews", count: stats.pending, color: "text-yellow-500" },
          { title: "Approved", count: stats.approved, color: "text-green-500" },
          { title: "Rejected", count: stats.rejected, color: "text-red-500" },
          { title: "High Priority", count: stats.highPriority, color: "text-orange-500" },
        ].map((stat, index) => (
          <div key={index} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-2">{stat.title}</h2>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Applicant</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Priority</th>
                <th className="p-2 border">Submitted</th>
                {canReview && <th className="p-2 border">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((application) => (
                <tr key={application._id} className="border">
                  <td className="p-2 border">{application.user?.name || "Unknown"}</td>
                  <td className="p-2 border capitalize">{application.category}</td>
                  <td className={`p-2 border ${application.priority >= 4 ? "text-red-500" : ""}`}>
                    Level {application.priority}
                  </td>
                  <td className="p-2 border">{new Date(application.createdAt).toLocaleDateString()}</td>
                  {canReview && (
                    <td className="p-2 border text-center">
                      {application.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(application._id, "approve")}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(application._id, "reject")}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded font-semibold ${
                            application.status === "approved" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
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
  );
}
