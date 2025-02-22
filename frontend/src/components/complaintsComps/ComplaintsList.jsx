import React, { useState } from "react";
import { ThumbsUp, Eye, Clock, CheckCircle, XCircle } from "lucide-react";

export function ComplaintsList({
  complaints,
  onVoteToReveal,
  currentUser,
  isLoading,
}) {
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter complaints based on the selected filter (case-insensitive)
  const filteredComplaints = complaints.filter((complaint) => {
    if (statusFilter === "all") return true;
    return complaint.status.toLowerCase() === statusFilter;
  });

  const canVoteToReveal =
    currentUser.role === "faculty" || currentUser.role === "admin";

  const getStatusIcon = (status) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  console.log(complaints);

  return (
    <div className="space-y-4">
      {/* Dropdown for filtering complaints by status */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
        <label htmlFor="statusFilter" className="text-gray-600 text-sm">
          Filter by status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredComplaints.map((complaint) => (
        <div key={complaint._id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-900">{complaint.content}</p>
              {complaint.proofUrl && (
                <img
                  src={complaint.proofUrl}
                  alt="Complaint proof"
                  className="mt-4 rounded-lg max-h-48 object-cover"
                />
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {getStatusIcon(complaint.status)}
              <span className="capitalize text-sm text-gray-600">
                {complaint.status}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 flex items-center">
                {complaint.isAnonymous && !complaint.isApprovedForReveal ? (
                  "Anonymous"
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    {complaint.submittedBy.name}
                  </>
                )}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
            </div>

            {complaint.isAnonymous &&
              !complaint.isApprovedForReveal &&
              canVoteToReveal && (
                <button
                  onClick={() => onVoteToReveal(complaint._id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={
                    complaint.votedBy &&
                    complaint.votedBy.includes(currentUser.id)
                  }
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Vote to Reveal ({complaint.votesForReveal || 0})
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
