import React, { useState, useEffect } from "react";
import axios from "axios";
import { ComplaintsList } from "../complaintsComps/ComplaintsList";
import { ModerationPanel } from "../complaintsComps/ModerationPanel";
import { MessageSquare, ShieldAlert, Users, AlertTriangle, CheckCircle2, XCircle, Clock, UserCircle2, UserCircle as UserCircleX, BarChart3 } from "lucide-react";

function FacultyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("complaints");
  const [isLoading, setIsLoading] = useState(true);

  const staticCurrentUser = {
    id: "67b8a457a5aa6e02d2b2a91e",
    name: "Faculty User",
    role: "faculty",
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/complaint/all",
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleVoteToReveal = async (complaintId) => {
    const complaint = complaints.find((c) => c._id === complaintId);
    if (complaint.votedBy && complaint.votedBy.includes(staticCurrentUser.id)) {
      return;
    }

    setComplaints((prev) =>
      prev.map((c) => {
        if (c._id === complaintId) {
          return {
            ...c,
            votesForReveal: (c.votesForReveal || 0) + 1,
            votedBy: [...(c.votedBy || []), staticCurrentUser.id],
          };
        }
        return c;
      })
    );

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/complaint/vote/${complaintId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedComplaint = response.data.complaint;
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? updatedComplaint : c))
      );
    } catch (error) {
      console.error("Error voting to reveal complaint:", error);
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? complaint : c))
      );
    }
  };

  const handleModerate = async (complaintId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/complaint/moderate/${complaintId}`,
        { action: action },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const tabs = [
    {
      id: "complaints",
      label: "All Complaints",
      icon: MessageSquare,
    },
    {
      id: "moderation",
      label: "Moderate",
      icon: ShieldAlert,
    },
    {
      id: "stats",
      label: "Statistics",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <AlertTriangle className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
                  Complaints Management
                </h1>
                <p className="text-gray-400 mt-1">
                  Review and moderate student complaints
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                      ${isActive 
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                        : "bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60"}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-800/50 rounded-full animate-pulse">
              <AlertTriangle className="h-12 w-12 text-purple-500" />
            </div>
            <p className="text-gray-300 text-lg mt-4">Loading complaints...</p>
          </div>
        ) : (
          <>
            {/* All Complaints Tab */}
            {activeTab === "complaints" && (
              <div>
                <ComplaintsList
                  complaints={complaints}
                  currentUser={staticCurrentUser}
                  onVoteToReveal={handleVoteToReveal}
                  isLoading={false}
                />
              </div>
            )}

            {/* Moderation Queue Tab */}
            {activeTab === "moderation" && (
              <div>
                <ModerationPanel
                  complaints={complaints}
                  onApprove={(id) => handleModerate(id, "approve")}
                  onReject={(id) => handleModerate(id, "reject")}
                />
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Status Overview */}
                <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6">
                  <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Complaint Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-400">Total</span>
                      <span className="text-lg font-semibold text-purple-400">{complaintStats.total}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-400">Pending</span>
                      <span className="text-lg font-semibold text-amber-400">{complaintStats.pending}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-400">Approved</span>
                      <span className="text-lg font-semibold text-emerald-400">{complaintStats.approved}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-400">Rejected</span>
                      <span className="text-lg font-semibold text-red-400">{complaintStats.rejected}</span>
                    </div>
                  </div>
                </div>

                {/* Anonymity Stats */}
                <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6">
                  <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center gap-2">
                    <UserCircle2 className="h-5 w-5 text-blue-400" />
                    Anonymity Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-400">Anonymous</span>
                      <span className="text-lg font-semibold text-blue-400">
                        {complaintStats.anonymous}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-gray-400">Identified</span>
                      <span className="text-lg font-semibold text-emerald-400">
                        {complaintStats.total - complaintStats.anonymous}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Legend */}
                <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6">
                  <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    Status Guide
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
                      <Clock className="h-5 w-5 text-amber-400" />
                      <span className="text-gray-300">Pending Review</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span className="text-gray-300">Approved</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
                      <XCircle className="h-5 w-5 text-red-400" />
                      <span className="text-gray-300">Rejected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FacultyComplaints;