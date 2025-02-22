import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, UserPlus, Calendar } from "lucide-react";
import axios from "axios";



function AdminElectionManage() {
  const [showNewElectionModal, setShowNewElectionModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPositionDetails, setSelectedPositionDetails] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    category: "upcoming",
    positions: [{ name: "President", candidates: [] }],
  });
  const [pendingElection, setPendingElection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    department: "",
    bio: "",
    photo_url: "",
    student: "",
  });

  // Fetch all elections when component mounts
  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/election/elections",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setElections(response.data);
    } catch (error) {
      console.error("Failed to fetch elections:", error);
      setError("Failed to load elections. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePositionClick = (position) => {
    setSelectedPositionDetails(
      selectedPositionDetails?.name === position.name ? null : position
    );
  };

  const handleCandidateInputChange = (e) => {
    const { id, value } = e.target;
    setCandidateForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const addPosition = () => {
    setFormData((prev) => ({
      ...prev,
      positions: [...prev.positions, { name: "", candidates: [] }],
    }));
  };

  const handlePositionChange = (index, value) => {
    const updatedPositions = [...formData.positions];
    updatedPositions[index].name = value;
    setFormData((prev) => ({
      ...prev,
      positions: updatedPositions,
    }));
  };

  const removePosition = (index) => {
    const updatedPositions = formData.positions.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      positions: updatedPositions,
    }));
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    // Create a pending election without sending to backend
    const newPendingElection = {
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      category: formData.category,
      positions: formData.positions.map((pos) => ({
        ...pos,
        id: Math.random().toString(36).substr(2, 9), // Temporary ID
      })),
    };

    setPendingElection(newPendingElection);
    setShowNewElectionModal(false);
    resetForm();
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();

    if (!selectedPosition) return;

    const updatedPositions = pendingElection.positions.map((pos) => {
      if (pos.id === selectedPosition.id) {
        return {
          ...pos,
          candidates: [
            ...(pos.candidates || []),
            {
              ...candidateForm,
              id: Math.random().toString(36).substr(2, 9),
            },
          ],
        };
      }
      return pos;
    });

    setPendingElection((prev) => ({
      ...prev,
      positions: updatedPositions,
    }));

    // Reset form and close modal
    setCandidateForm({
      name: "",
      department: "",
      bio: "",
      photo_url: "",
    });
    setShowCandidateModal(false);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const formattedData = {
        title: pendingElection.title,
        startDate: pendingElection.startDate,
        endDate: pendingElection.endDate,
        positions: pendingElection.positions.map((pos) => ({
          name: pos.name,
          candidates: pos.candidates.map((candidate) => ({
            name: candidate.name,
            department: candidate.department,
            bio: candidate.bio,
            photo_url: candidate.photo_url,
            student: candidate.student,
          })),
        })),
      };

      await axios.post("http://localhost:3000/api/election", formattedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the elections list
      await fetchElections();
      setSuccessMessage("Election created successfully!");
      setPendingElection(null);
    } catch (error) {
      console.error("Error creating election:", error);
      setError(error.response?.data?.message || "Failed to create election");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      startDate: "",
      endDate: "",
      category: "upcoming",
      positions: [{ name: "President", candidates: [] }],
    });
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Elections Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your election events from here
          </p>
        </div>
        <button
          onClick={() => setShowNewElectionModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Election
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage(null)}
          >
            <span className="text-green-500">×</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="text-gray-500">Loading elections...</div>
        </div>
      )}

      {/* Pending Election Section */}
      {pendingElection && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          {/* ... (keep existing pending election code) */}
        </div>
      )}

      {/* Existing Elections List */}
      {!isLoading && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {elections.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No elections found. Create your first election!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {elections.map((election) => (
                <li key={election._id} className="hover:bg-gray-50">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {election.title}
                        </h3>
                        <div className="mt-1 flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-sm text-gray-500">
                            {new Date(election.startDate).toLocaleDateString()}{" "}
                            - {new Date(election.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex space-x-4">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Display Positions and Candidates */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">
                        Positions
                      </h4>
                      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {election.positions.map((position) => (
                          <div key={position._id}>
                            <div
                              onClick={() => handlePositionClick(position)}
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                selectedPositionDetails?.name === position.name
                                  ? "bg-indigo-50 border-indigo-300"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <h5 className="font-medium text-gray-900">
                                {position.name}
                              </h5>

                              {/* Expandable candidates section */}
                              {selectedPositionDetails?.name ===
                                position.name && (
                                <div className="mt-4 space-y-3">
                                  <h6 className="text-sm font-medium text-gray-700">
                                    Candidates:
                                  </h6>
                                  {position.candidates &&
                                  position.candidates.length > 0 ? (
                                    position.candidates.map((candidate) => (
                                      <div
                                        key={candidate._id}
                                        className="bg-white p-3 rounded-md shadow-sm border border-gray-100"
                                      >
                                        <div className="flex items-center space-x-3">
                                          {candidate.photo_url && (
                                            <img
                                              src={candidate.photo_url}
                                              alt={candidate.name}
                                              className="h-10 w-10 rounded-full object-cover"
                                            />
                                          )}
                                          <div>
                                            <p className="text-sm font-medium text-gray-900">
                                              {candidate.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {candidate.department}
                                            </p>
                                            {candidate.bio && (
                                              <p className="text-xs text-gray-600 mt-1">
                                                {candidate.bio}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      No candidates yet
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage(null)}
          >
            <span className="text-green-500">×</span>
          </button>
        </div>
      )}

      {/* Pending Election Section */}
      {pendingElection && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">
              Pending Election: {pendingElection.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add candidates to positions before finalizing the election
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pendingElection.positions.map((position) => (
                  <div key={position.id} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">
                      {position.name}
                    </h4>
                    <div className="mt-2 space-y-2">
                      {position.candidates?.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center space-x-3 bg-gray-50 p-2 rounded"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {candidate.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {candidate.department}
                            </p>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setSelectedPosition(position);
                          setShowCandidateModal(true);
                        }}
                        className="w-full mt-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center justify-center"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Candidate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {isSubmitting ? "Submitting..." : "Finalize Election"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Elections List */}
      {/* <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {elections.map((election) => (
            <li key={election.id}>
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {election.name}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-500">
                        {new Date(election.startDate).toLocaleDateString()} -{" "}
                        {new Date(election.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div> */}

      {/* New Election Modal */}
      {showNewElectionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Election
            </h3>
            <form className="space-y-4" onSubmit={handleCreateElection}>
              {/* Existing form fields remain the same */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Election Name
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Positions
                  </label>
                  <button
                    type="button"
                    onClick={addPosition}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    + Add Position
                  </button>
                </div>
                <div className="mt-2 space-y-3">
                  {formData.positions.map((position, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={position.name}
                        onChange={(e) =>
                          handlePositionChange(index, e.target.value)
                        }
                        placeholder="Position name"
                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removePosition(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewElectionModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Election
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showCandidateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Candidate for {selectedPosition?.name}
            </h3>
            <form className="space-y-4" onSubmit={handleAddCandidate}>
              <div>
                <label
                  htmlFor="student"
                  className="block text-sm font-medium text-gray-700"
                >
                  Student ID
                </label>
                <input
                  type="text"
                  id="student"
                  value={candidateForm.student}
                  onChange={handleCandidateInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter student ID"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={candidateForm.name}
                  onChange={handleCandidateInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter candidate's full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  value={candidateForm.department}
                  onChange={handleCandidateInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={candidateForm.bio}
                  onChange={handleCandidateInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief description of the candidate"
                />
              </div>

              <div>
                <label
                  htmlFor="photo_url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Photo URL
                </label>
                <input
                  type="url"
                  id="photo_url"
                  value={candidateForm.photo_url}
                  onChange={handleCandidateInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter photo URL"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCandidateModal(false);
                    setCandidateForm({
                      name: "",
                      department: "",
                      bio: "",
                      photo_url: "",
                      student: "", // Reset student field
                    });
                  }}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminElectionManage;
