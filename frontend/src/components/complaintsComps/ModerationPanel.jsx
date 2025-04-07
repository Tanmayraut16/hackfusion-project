import React, { useState } from "react";
import { Filter, CheckCircle, XCircle, AlertTriangle, MessageSquare, Calendar, User, ChevronDown, ChevronUp } from "lucide-react";

export function ModerationPanel({ complaints, onApprove, onReject }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedComplaint, setExpandedComplaint] = useState(null);

  // Filter the complaints based on status using a case-insensitive check
  const filteredComplaints = complaints.filter(
    (complaint) =>
      statusFilter === "all" || complaint.status.toLowerCase() === statusFilter
  );

  // Handle the Approve/Reject action, calling parent callbacks
  const handleAction = async (action, complaintId, e) => {
    e.stopPropagation();
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

  const toggleExpand = (id) => {
    if (expandedComplaint === id) {
      setExpandedComplaint(null);
    } else {
      setExpandedComplaint(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Dropdown */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
        <Filter className="h-5 w-5 text-purple-400" />
        <select
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

      {/* Complaints Table */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-750">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Complaint
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
                      {expandedComplaint === complaint._id ? (
                        <ChevronUp className="h-4 w-4 ml-2 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-400">
                      {complaint.isAnonymous ? (
                        <>
                          <User className="h-4 w-4 mr-1" />
                          Anonymous
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 mr-1" />
                          {complaint.submittedBy?.name || "Unknown"}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {complaint.status.toLowerCase() === "pending" ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => handleAction("approve", complaint._id, e)}
                          disabled={isLoading}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={(e) => handleAction("reject", complaint._id, e)}
                          disabled={isLoading}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </button>
                      </div>
                    ) : complaint.status.toLowerCase() === "approved" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejected
                      </span>
                    )}
                  </td>
                </tr>
                {expandedComplaint === complaint._id && (
                  <tr className="bg-gray-800">
                    <td colSpan={4} className="px-6 py-4 border-t border-gray-700">
                      <div className="text-gray-300 mb-4">
                        {complaint.content}
                      </div>
                      {complaint.proofUrl && (
                        <div className="mt-4 border border-gray-700 rounded-lg overflow-hidden max-w-lg mx-auto">
                          <div className="bg-gray-900 p-2 text-xs text-gray-400 font-medium">Evidence Image</div>
                          <div className="relative bg-black flex justify-center items-center">
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
                      
                      {complaint.status.toLowerCase() === "pending" && (
                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            onClick={(e) => handleAction("approve", complaint._id, e)}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Complaint
                          </button>
                          <button
                            onClick={(e) => handleAction("reject", complaint._id, e)}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Complaint
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filteredComplaints.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                  <p>No complaints found matching the selected filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}