import React, { useState, useEffect } from "react";
import axios from "axios";
import { ComplaintsList } from "../complaintsComps/ComplaintsList";
import { ModerationPanel } from "../complaintsComps/ModerationPanel";
import { MessageSquare, ShieldAlert, Users } from "lucide-react";

function FacultyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("complaints");

  // Static user (faculty) with a unique id (as a string)
  const staticCurrentUser = {
    id: "67b8a457a5aa6e02d2b2a91e", // ensure this matches your DB's format
    name: "Faculty User",
    role: "faculty",
  };

  // Fetch complaints on mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/complaint/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Process complaints: if identity is revealed, force isAnonymous false.
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

  // Vote to Reveal: perform optimistic update and then call backend
  const handleVoteToReveal = async (complaintId) => {
    // Find the complaint from state
    const complaint = complaints.find((c) => c._id === complaintId);
    // If already voted, exit early
    if (complaint.votedBy && complaint.votedBy.includes(staticCurrentUser.id)) {
      return;
    }

    // Optimistically update the vote count and votedBy array
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
      // Update state with the backend response to ensure data is in sync
      const updatedComplaint = response.data.complaint;
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? updatedComplaint : c))
      );
    } catch (error) {
      console.error("Error voting to reveal complaint:", error);
      // Optionally revert the optimistic update if there's an error.
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? complaint : c))
      );
    }
  };

  // Approve or Reject a complaint (for moderation)
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

  // Calculate real-time stats from the complaints data
  const complaintStats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    approved: complaints.filter((c) => c.status === "Approved").length,
    rejected: complaints.filter((c) => c.status === "Rejected").length,
    anonymous: complaints.filter((c) => c.isAnonymous).length,
  };

  return (
    <div>
      {/* Tabs for navigation */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("complaints")}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === "complaints"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          All Complaints
        </button>
        <button
          onClick={() => setActiveTab("moderation")}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === "moderation"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ShieldAlert className="h-5 w-5 mr-2" />
          Moderate
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === "stats"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          Statistics
        </button>
      </div>

      {/* All Complaints Tab */}
      {activeTab === "complaints" && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            All Complaints
          </h2>
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Moderation Queue
          </h2>
          <ModerationPanel
            complaints={complaints}
            onApprove={(id) => handleModerate(id, "approve")}
            onReject={(id) => handleModerate(id, "reject")}
          />
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Complaint Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Complaints</span>
                <span className="font-semibold">{complaintStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {complaintStats.pending}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <span className="font-semibold text-green-600">
                  {complaintStats.approved}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">
                  {complaintStats.rejected}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Anonymity
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Anonymous</span>
                <span className="font-semibold">
                  {complaintStats.anonymous}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Identified</span>
                <span className="font-semibold">
                  {complaintStats.total - complaintStats.anonymous}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyComplaints;
