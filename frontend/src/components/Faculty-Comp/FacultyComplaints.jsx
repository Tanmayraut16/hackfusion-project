import React, { useState } from 'react';
import { ComplaintsList } from '../complaintsComps/ComplaintsList';
import { ModerationPanel } from '../complaintsComps/ModerationPanel';
import { MessageSquare, ShieldAlert } from 'lucide-react';

function FacultyComplaints() {
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState([
    { id: 1, title: 'Library Issue', status: 'pending', isAnonymous: false },
    { id: 2, title: 'Canteen Hygiene', status: 'approved', isAnonymous: true },
  ]);

  const currentUser = { name: 'Faculty User', role: 'faculty' };

  const onVoteToReveal = (id) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, votes: (complaint.votes || 0) + 1 } : complaint
      )
    );
  };

  const onModerate = (id, action) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, status: action === 'approve' ? 'approved' : 'rejected' } : complaint
      )
    );
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
          View Complaints
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
      </div>

      {activeTab === 'complaints' ? (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Complaints</h2>
          <ComplaintsList
            complaints={complaints}
            currentUser={currentUser}
            onVoteToReveal={onVoteToReveal}
          />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Moderation Queue</h2>
          <ModerationPanel
            complaints={complaints}
            onApprove={(id) => onModerate(id, 'approve')}
            onReject={(id) => onModerate(id, 'reject')}
          />
        </div>
      )}
    </div>
  );
}

export default FacultyComplaints;
