import React, { useState } from 'react';
import { ComplaintsList } from '../complaintsComps/ComplaintsList';
import { ModerationPanel } from '../complaintsComps/ModerationPanel';
import { MessageSquare, ShieldAlert, Users } from 'lucide-react';

function AdminComplaints() {
  // Define static complaints data
  const staticComplaints = [
    {
      id: "1",
      content: "Complaint regarding the broken projector in room 101.",
      proof: "",
      status: "pending",
      isAnonymous: true,
      submitterName: "Student A",
      isApprovedForReveal: false,
      votes: 2,
      createdAt: "2025-01-10T12:00:00Z"
    },
    {
      id: "2",
      content: "Complaint about outdated library resources.",
      proof: "",
      status: "approved",
      isAnonymous: false,
      submitterName: "Student B",
      isApprovedForReveal: true,
      votes: 15,
      createdAt: "2025-01-08T09:30:00Z"
    },
    {
      id: "3",
      content: "Complaint regarding the cafeteria's food quality.",
      proof: "",
      status: "rejected",
      isAnonymous: true,
      submitterName: "Student C",
      isApprovedForReveal: false,
      votes: 5,
      createdAt: "2025-01-09T14:45:00Z"
    }
  ];

  // Define a static current user (admin)
  const staticCurrentUser = {
    name: "Admin User",
    role: "admin"
  };

  // Local state for complaints and active dashboard tab
  const [complaints, setComplaints] = useState(staticComplaints);
  const [activeTab, setActiveTab] = useState('complaints');

  // Compute complaint statistics from state
  const complaintStats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    approved: complaints.filter(c => c.status === 'approved').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
    anonymous: complaints.filter(c => c.isAnonymous).length,
  };

  // Handler to update votes and reveal status
  const handleVoteToReveal = (complaintId) => {
    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        const newVotes = complaint.votes + 1;
        return {
          ...complaint,
          votes: newVotes,
          isApprovedForReveal: newVotes >= 10
        };
      }
      return complaint;
    }));
  };

  // Handler to moderate a complaint (approve or reject)
  const handleModerate = (complaintId, action) => {
    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          status: action === 'approve' ? 'approved' : 'rejected'
        };
      }
      return complaint;
    }));
  };

  return (
    <div>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === 'complaints'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          All Complaints
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === 'moderation'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ShieldAlert className="h-5 w-5 mr-2" />
          Moderate
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === 'stats'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          Statistics
        </button>
      </div>

      {activeTab === 'complaints' && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Complaints</h2>
          <ComplaintsList
            complaints={complaints}
            currentUser={staticCurrentUser}
            onVoteToReveal={handleVoteToReveal}
          />
        </div>
      )}

      {activeTab === 'moderation' && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Moderation Queue</h2>
          <ModerationPanel
            complaints={complaints}
            onApprove={(id) => handleModerate(id, 'approve')}
            onReject={(id) => handleModerate(id, 'reject')}
          />
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Complaints</span>
                <span className="font-semibold">{complaintStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">{complaintStats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <span className="font-semibold text-green-600">{complaintStats.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">{complaintStats.rejected}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Anonymity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Anonymous</span>
                <span className="font-semibold">{complaintStats.anonymous}</span>
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
export default AdminComplaints;