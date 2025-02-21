import React, { useState } from 'react';
import { ComplaintForm } from '../complaintsComps/ComplaintForm';
import { ComplaintsList } from '../complaintsComps/ComplaintsList';
import { MessageSquare, ListFilter } from 'lucide-react';

function StudentComplaints() {
  const currentUser = { name: 'John Doe', role: 'student' };

  const [complaints, setComplaints] = useState([
    { id: '1', content: 'Broken chair in library', status: 'pending', isAnonymous: false, submitterName: 'John Doe', createdAt: '2025-02-20', votes: 0 },
    { id: '2', content: 'Wi-Fi issues in hostel', status: 'approved', isAnonymous: true, submitterName: 'Anonymous', createdAt: '2025-02-18', votes: 5 }
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleSubmitComplaint = (data) => {
    const newComplaint = {
      id: String(complaints.length + 1),
      content: data.content,
      status: 'pending',
      isAnonymous: data.isAnonymous,
      submitterName: data.isAnonymous ? 'Anonymous' : currentUser.name,
      createdAt: new Date().toISOString(),
      votes: 0
    };

    setComplaints([newComplaint, ...complaints]);
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const isMyComplaint = !complaint.isAnonymous && complaint.submitterName === currentUser.name;
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;

    if (activeTab === 'my') return isMyComplaint && matchesStatus;
    return matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('submit')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === 'submit' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Submit Complaint
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ListFilter className="h-5 w-5 mr-2" />
          All Complaints
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === 'my' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          My Complaints
        </button>
      </div>

      {activeTab === 'submit' ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Submit a Complaint</h2>
          <ComplaintForm onSubmit={handleSubmitComplaint} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {activeTab === 'my' ? 'My Complaints' : 'All Complaints'}
            </h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Filter by status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <ComplaintsList
            complaints={filteredComplaints}
            currentUser={currentUser}
            onVoteToReveal={() => {}}
          />
        </div>
      )}
    </div>
  );
}

export default StudentComplaints;
