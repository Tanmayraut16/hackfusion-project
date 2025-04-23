import React, { useState, useEffect } from "react";
import axios from "axios";
import { ComplaintsList } from "../complaintsComps/ComplaintsList";
import { ModerationPanel } from "../complaintsComps/ModerationPanel";
import { MessageSquare, ShieldAlert, Users, AlertCircle, CheckCircle, XCircle, UserX, User } from "lucide-react";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("complaints");

  const staticCurrentUser = {
    name: "Admin User",
    role: "admin",
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/complaint/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const processedComplaints = response.data.map((complaint) =>
          complaint.isApprovedForReveal
            ? { ...complaint, isAnonymous: false }
            : complaint
        );

        setComplaints(processedComplaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  const handleVoteToReveal = async (complaintId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/complaint/vote/${complaintId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedComplaint = response.data.complaint;
      updatedComplaint.hasVoted = true;
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? updatedComplaint : c))
      );
    } catch (error) {
      console.error("Error voting to reveal complaint:", error);
    }
  };

  const handleModerate = async (complaintId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/complaint/moderate/${complaintId}`,
        { action: action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedComplaint = response.data.complaint;
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? updatedComplaint : c))
      );
    } catch (error) {
      console.error("Error moderating complaint:", error);
    }
  };

  const complaintStats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    approved: complaints.filter((c) => c.status === "Approved").length,
    rejected: complaints.filter((c) => c.status === "Rejected").length,
    anonymous: complaints.filter((c) => c.isAnonymous).length,
  };

  return (
    <div className="min-h-screen  text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <AlertCircle className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Complaints Management Dashboard
          </h1>
        </div>

        <div className="flex space-x-4 mb-8 bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg">
          <button
            onClick={() => setActiveTab("complaints")}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "complaints"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
                : "text-gray-400 hover:bg-gray-700/50"
            }`}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            All Complaints
          </button>
          <button
            onClick={() => setActiveTab("moderation")}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "moderation"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
                : "text-gray-400 hover:bg-gray-700/50"
            }`}
          >
            <ShieldAlert className="h-5 w-5 mr-2" />
            Moderate
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "stats"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
                : "text-gray-400 hover:bg-gray-700/50"
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Statistics
          </button>
        </div>

        {activeTab === "complaints" && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-6">
              All Complaints
            </h2>
            <ComplaintsList
              complaints={complaints}
              currentUser={staticCurrentUser}
              onVoteToReveal={handleVoteToReveal}
            />
          </div>
        )}

        {activeTab === "moderation" && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-6">
              Moderation Queue
            </h2>
            <ModerationPanel
              complaints={complaints}
              onApprove={(id) => handleModerate(id, "approve")}
              onReject={(id) => handleModerate(id, "reject")}
            />
          </div>
        )}

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-medium text-yellow-400">Pending</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-500">{complaintStats.pending}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-medium text-green-400">Approved</h3>
              </div>
              <p className="text-3xl font-bold text-green-500">{complaintStats.approved}</p>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-medium text-red-400">Rejected</h3>
              </div>
              <p className="text-3xl font-bold text-red-500">{complaintStats.rejected}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium text-blue-400">Total</h3>
              </div>
              <p className="text-3xl font-bold text-blue-500">{complaintStats.total}</p>
            </div>

            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <UserX className="h-5 w-5 text-purple-400" />
                  Anonymous Complaints
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Anonymous</span>
                    <span className="text-xl font-bold text-purple-400">
                      {complaintStats.anonymous}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Identified</span>
                    <span className="text-xl font-bold text-purple-400">
                      {complaintStats.total - complaintStats.anonymous}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-400" />
                  Complaint Distribution
                </h3>
                <div className="relative pt-4">
                  <div className="flex h-2 mb-4 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="bg-yellow-500"
                      style={{
                        width: `${(complaintStats.pending / complaintStats.total) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${(complaintStats.approved / complaintStats.total) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${(complaintStats.rejected / complaintStats.total) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Pending</span>
                    <span>Approved</span>
                    <span>Rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminComplaints;