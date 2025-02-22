import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const VotingModal = ({ election, position, onClose }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidateNames = async () => {
      const updatedCandidates = await Promise.all(
        position.candidates.map(async (candidate) => {
          const name = await getStudentName(candidate.student);
          return { ...candidate, name };
        })
      );
      setCandidates(updatedCandidates);
    };

    fetchCandidateNames();
  }, [position.candidates]);

  const getStudentName = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/student-login/profile/${studentId}`
      );
      if (!response.ok) throw new Error("Failed to fetch student profile");

      const data = await response.json();
      return data.name || "Unknown";
    } catch (error) {
      console.error("Error fetching student name:", error);
      return "Unknown";
    }
  };

  // console.log(election._id);

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate to vote");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("User not authenticated. Please log in again.");
      }

      const response = await fetch("http://localhost:3000/api/election/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
        body: JSON.stringify({
          electionId: election._id,
          positionName: position.name,
          candidateName: selectedCandidate.name,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Vote cast successfully");
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Vote for {position.name}</h2>
        <div className="space-y-3">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className={`p-3 border rounded cursor-pointer ${
                selectedCandidate && selectedCandidate._id === candidate._id
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              {candidate.name}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleVote}
            disabled={loading}
          >
            {loading ? "Voting..." : "Vote"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;
