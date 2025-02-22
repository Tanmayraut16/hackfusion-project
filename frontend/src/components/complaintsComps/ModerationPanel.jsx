import React, { useState } from "react";
import { Filter, CheckCircle, XCircle } from "lucide-react";

export function ModerationPanel({ complaints, onApprove, onReject }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Filter the complaints based on status using a case-insensitive check
  const filteredComplaints = complaints.filter(
    (complaint) =>
      statusFilter === "all" || complaint.status.toLowerCase() === statusFilter
  );

  // Handle the Approve/Reject action, calling parent callbacks
  const handleAction = async (action, complaintId) => {
    setIsLoading(true);
    try {
      if (action === "approve") {
        await onApprove(complaintId);
      } else {
        await onReject(complaintId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Dropdown */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
        <Filter className="h-5 w-5 text-gray-500" />
        <select
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

      {/* Render Complaints */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint._id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
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
            </div>

            <div className="flex items-center space-x-2">
              {complaint.status === "Pending" ? (
                <>
                  <button
                    onClick={() => handleAction("approve", complaint._id)}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction("reject", complaint._id)}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </>
              ) : complaint.status === "Approved" ? (
                <div className="inline-flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approved
                </div>
              ) : complaint.status === "Rejected" ? (
                <div className="inline-flex items-center text-red-600">
                  <XCircle className="h-4 w-4 mr-1" />
                  Rejected
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
