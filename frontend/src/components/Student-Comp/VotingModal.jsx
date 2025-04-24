import React, { useState, useEffect } from 'react';
import { Check, X, Vote, Loader2, AlertCircle, Users, Trophy } from 'lucide-react';

const VotingModal = ({ election, position, onClose }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
      setError('Please select a candidate to vote');
      return;
    }

    setLoading(true);
    setError('');
    
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

      setSuccess(true);  // ✅ Add this line
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-2xl bg-gradient-to-b from-zinc-900/90 to-black/90 rounded-xl 
                    border border-zinc-800/80 shadow-2xl overflow-hidden backdrop-blur-md
                    transition-all duration-300 animate-slideUp">
        {/* Header */}
        <div className="relative px-6 py-5 bg-zinc-900/50 border-b border-zinc-800/60">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-zinc-400 hover:text-white 
                     transition-colors hover:rotate-90 duration-300"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
              <Vote size={20} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">Cast Your Vote</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Select your candidate for <span className="text-indigo-400">{position.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 py-3 bg-zinc-900/30 border-b border-zinc-800/60">
          <div className="flex items-center justify-around">
            <div className="flex items-center space-x-2 text-zinc-400">
              <Users size={16} />
              <span className="text-sm">Total Voters: 363</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-400">
              <Trophy size={16} />
              <span className="text-sm">Leading: Alexandra T.</span>
            </div>
          </div>
        </div>

        {/* Candidates List */}
        <div className="p-6 space-y-3">
          {candidates.map((candidate) => (
            <button
              key={candidate._id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`w-full group relative flex items-center p-5 rounded-lg border-2 
                       transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                       ${selectedCandidate?._id === candidate._id
                        ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50'
                      }`}
            >
              <div className="flex-1">
                <h3 className="font-medium text-lg">{candidate.name}</h3>
                {candidate.manifesto && (
                  <p className="text-sm mt-1 text-zinc-400 group-hover:text-zinc-300">
                    {candidate.manifesto}
                  </p>
                )}
              </div>
              <div className={`ml-4 w-7 h-7 rounded-full border-2 flex items-center justify-center 
                           transition-all duration-200 ${
                            selectedCandidate?._id === candidate._id
                              ? 'border-indigo-500 bg-indigo-500 scale-110'
                              : 'border-zinc-600 group-hover:border-zinc-500'
                           }`}>
                {selectedCandidate?._id === candidate._id && (
                  <Check size={16} className="text-white" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pb-4">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-slideIn">
              <div className="flex items-center space-x-2">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800/60 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white 
                     transition-colors rounded-lg hover:bg-zinc-800/50"
          >
            Cancel
          </button>
          <button
            onClick={handleVote}
            disabled={!selectedCandidate || loading || success}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
                     flex items-center space-x-2 shadow-lg ${
                      !selectedCandidate
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : success
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : loading
                        ? 'bg-indigo-600/50 text-white cursor-wait'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/20 active:scale-98'
                     }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : success ? (
              <>
                <Check size={16} />
                <span>Vote Recorded!</span>
              </>
            ) : (
              <>
                <Vote size={16} />
                <span>Submit Vote</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;