import React, { useState } from 'react';
import { Filter, CheckCircle, XCircle } from 'lucide-react';

export function ModerationPanel({ complaints, onApprove, onReject }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredComplaints = complaints.filter(
    (complaint) => statusFilter === 'all' || complaint.status === statusFilter
  );

  const handleAction = async (action, complaintId) => {
    setIsLoading(true);
    try {
      if (action === 'approve') {
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

      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-900">{complaint.content}</p>
                {complaint.proof && (
                  <img
                    src={complaint.proof}
                    alt="Complaint proof"
                    className="mt-4 rounded-lg max-h-48 object-cover"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">
                  {complaint.isAnonymous ? 'Anonymous' : complaint.submitterName}
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>

              {complaint.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction('approve', complaint.id)}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction('reject', complaint.id)}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
