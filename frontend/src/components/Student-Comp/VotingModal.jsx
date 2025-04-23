import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

const VotingModal = ({ election, position, onClose }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidateNames = async () => {
      const updatedCandidates = await Promise.all(
        position.candidates.map(async (candidate) => {
          const name = await getStudentName(candidate.student._id);
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
        `${import.meta.env.VITE_API_URL}/api/student-login/profile/${studentId}`
      );
      if (!response.ok) throw new Error("Failed to fetch student profile");

      const data = await response.json();
      return data.name || "Unknown";
    } catch (error) {
      console.error("Error fetching student name:", error);
      return "Unknown";
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      // We'll handle this with UI feedback instead of a toast
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated. Please log in again.");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/election/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          electionId: election._id,
          positionName: position.name,
          candidateName: selectedCandidate.name,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-gradient-to-b from-zinc-900 to-black rounded-xl border border-zinc-800 shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="relative px-6 py-4 bg-zinc-900/50 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-medium text-white">Cast Your Vote</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Select your candidate for {position.name}
          </p>
        </div>

        {/* Candidates List */}
        <div className="p-6 space-y-4">
          {candidates.map((candidate) => (
            <button
              key={candidate._id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`w-full group relative flex items-center p-4 rounded-lg border transition-all duration-200 ${
                selectedCandidate?._id === candidate._id
                  ? 'bg-indigo-600/10 border-indigo-500 text-white'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex-1">
                <h3 className="font-medium">{candidate.name}</h3>
              </div>
              <div className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                selectedCandidate?._id === candidate._id
                  ? 'border-indigo-500 bg-indigo-500'
                  : 'border-zinc-600'
              }`}>
                {selectedCandidate?._id === candidate._id && (
                  <Check size={14} className="text-white" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleVote}
            disabled={!selectedCandidate || loading}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !selectedCandidate
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : loading
                ? 'bg-indigo-600/50 text-white cursor-wait'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Vote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;