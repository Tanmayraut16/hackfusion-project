import React, { useState } from "react";
import { ThumbsUp, Eye, Clock, CheckCircle, XCircle, MessageSquare, Calendar, User } from "lucide-react";

export function ComplaintsList({
  complaints,
  onVoteToReveal,
  currentUser,
  isLoading,
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedComplaint, setExpandedComplaint] = useState(null);

  // Filter complaints based on the selected filter (case-insensitive)
  const filteredComplaints = complaints.filter((complaint) => {
    if (statusFilter === "all") return true;
    return complaint.status.toLowerCase() === statusFilter;
  });

  const canVoteToReveal =
    currentUser.role === "faculty" || currentUser.role === "admin";

  const getStatusBadge = (status) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return (
          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const toggleExpand = (id) => {
    if (expandedComplaint === id) {
      setExpandedComplaint(null);
    } else {
      setExpandedComplaint(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dropdown for filtering complaints by status */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
        <label htmlFor="statusFilter" className="text-gray-300 text-sm">
          Filter by status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-40 rounded-md border-gray-700 bg-gray-800 text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Complaint Table */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-750">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Complaint
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Submitted By
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {filteredComplaints.map((complaint) => (
              <React.Fragment key={complaint._id}>
                <tr 
                  className={`hover:bg-gray-800 cursor-pointer transition-colors ${expandedComplaint === complaint._id ? 'bg-gray-800' : ''}`}
                  onClick={() => toggleExpand(complaint._id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-purple-400 mr-3" />
                      <div className="text-sm text-gray-200 line-clamp-1">
                        {complaint.content}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(complaint.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-400">
                      {complaint.isAnonymous && !complaint.isApprovedForReveal ? (
                        <>
                          <User className="h-4 w-4 mr-1" />
                          Anonymous
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          {complaint.submittedBy.name}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {complaint.isAnonymous &&
                      !complaint.isApprovedForReveal &&
                      canVoteToReveal && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onVoteToReveal(complaint._id);
                          }}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                          disabled={
                            complaint.votedBy &&
                            complaint.votedBy.includes(currentUser.id)
                          }
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Vote ({complaint.votesForReveal || 0})
                        </button>
                      )}
                  </td>
                </tr>
                {expandedComplaint === complaint._id && (
                  <tr className="bg-gray-800">
                    <td colSpan={5} className="px-6 py-4 border-t border-gray-700">
                      <div className="text-gray-300 mb-4">
                        {complaint.content}
                      </div>
                      {complaint.proofUrl && (
                        <div className="mt-4 border border-gray-700 rounded-lg overflow-hidden max-w-lg mx-auto">
                          <div className="bg-gray-900 p-2 text-xs text-gray-400">Evidence Image</div>
                          <div className="relative bg-gray-900 flex justify-center items-center">
                            <img
                              src={complaint.proofUrl}
                              alt="Complaint evidence"
                              className="max-h-96 object-contain w-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filteredComplaints.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No complaints found matching the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}