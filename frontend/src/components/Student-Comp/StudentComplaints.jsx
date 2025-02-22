import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ComplaintForm } from '../complaintsComps/ComplaintForm';
import { ComplaintsList } from '../complaintsComps/ComplaintsList';
import { MessageSquare, ListFilter } from 'lucide-react';

function StudentComplaints() {
  const currentUser = { name: 'John Doe', role: 'student' };

  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch complaints data from the backend when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/complaint/all')
      .then(response => {
        setComplaints(response.data);
      })
      .catch(error => {
        console.error('Error fetching complaints:', error);
      });
  }, []);

  // const handleSubmitComplaint = (data) => {

  //   const formData = new FormData();
  //   formData.append('content', data.content);
  //   formData.append('isAnonymous', data.isAnonymous);

  //   if (data.imageFile) {
  //     formData.append('proof', data.imageFile);
  //   }

  //   // (Optional) Debug: Log the formData keys/values
  //   for (let pair of formData.entries()) {
  //     console.log(pair[0] + ':', pair[1]);
  //   }

  //   const token = localStorage.getItem('token');

  //   axios
  //     .post('http://localhost:3000/api/complaint/submit', formData, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       const createdComplaint = response.data.complaint;
  //       setComplaints((prevComplaints) => [createdComplaint, ...prevComplaints]);
  //       setActiveTab('all');
  //     })
  //     .catch((error) => {
  //       console.error('Error submitting complaint:', error);
  //     });
  // };

  // Filter complaints to show only the current user's complaints when the "My Complaints" tab is active


  const handleSubmitComplaint = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found");
  
      const response = await axios.post(
        'http://localhost:3000/api/complaint/submit',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data.complaint) {
        setComplaints((prevComplaints) => [response.data.complaint, ...prevComplaints]);
        setActiveTab('all');
      } else {
        throw new Error(response.data.message || "Failed to submit complaint");
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      throw error; // Propagate error to form component
    }
  };
  
  const filteredComplaints = complaints.filter((complaint) => {
    console.log(complaint);
    const isMyComplaint = !complaint.isAnonymous && complaint.submitterName === currentUser.name;
    return activeTab === 'my' ? isMyComplaint : true;
  });

  return (
    <div className="space-y-8">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('submit')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === 'submit'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Submit Complaint
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ListFilter className="h-5 w-5 mr-2" />
          All Complaints
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            activeTab === 'my'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
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
          <h2 className="text-2xl font-semibold text-gray-900">
            {activeTab === 'my' ? 'My Complaints' : 'All Complaints'}
          </h2>
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
