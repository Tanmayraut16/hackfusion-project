import React, { useState, useEffect } from "react";
import VotingModal from "../../components/Student-Comp/VotingModal";
import OTPModal from "../../components/Student-Comp/OTPModal";
import ElectionResults from "../../components/Student-Comp/ElectionResults";
import { Calendar, Clock, Users, Trophy, ChevronLeft, AlertCircle, Loader2, Vote, CalendarCheck, History, Timer } from 'lucide-react';
import axios from "axios";

const StudentElections = () => {
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ongoing");
  const [elections, setElections] = useState({
    ongoing: [],
    upcoming: [],
    done: [],
  });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [positionVotingStatus, setPositionVotingStatus] = useState({});

  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/election/elections`
        );
        if (!response.ok) throw new Error("Failed to load elections.");

        const data = await response.json();
        const now = new Date();

        setElections({
          ongoing: data.filter(
            (e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now
          ),
          upcoming: data.filter((e) => new Date(e.startDate) > now),
          done: data.filter((e) => new Date(e.endDate) < now),
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const fetchElectionById = async (id) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/election/elections/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedElection(response.data);
      await handleVoteRender(id);
    } catch (error) {
      console.error("Error fetching election:", error);
      setError(
        error.response?.data?.message || "Failed to fetch election details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = (position) => {
    setSelectedPosition(position);
    setShowOTPModal(true);
  };

  const handleVoteRender = async (electionID) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/election/voters/${electionID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const votingStatus = {};
      response.data.positions.forEach((position) => {
        votingStatus[position._id] = {
          hasVoted: position.hasVoted,
          votedCandidate: position.votedCandidate,
        };
      });

      setPositionVotingStatus(votingStatus);
    } catch (err) {
      console.error("Error getting voting status:", err);
    }
  };

  useEffect(() => {
    if (selectedElection) {
      handleVoteRender(selectedElection._id);
    }
  }, [selectedElection]);

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'ongoing':
        return <Vote className="w-4 h-4" />;
      case 'upcoming':
        return <CalendarCheck className="w-4 h-4" />;
      case 'done':
        return <History className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderPositionContent = (position) => {
    if (!position.candidates || position.candidates.length === 0) {
      return (
        <div className="flex items-center justify-center h-24 text-zinc-400">
          <p>No candidates for this position.</p>
        </div>
      );
    }

    if (activeTab === "ongoing") {
      return positionVotingStatus[position._id]?.hasVoted ? (
        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-400 font-medium">Vote Recorded</p>
          </div>
          {positionVotingStatus[position._id]?.votedCandidate && (
            <p className="text-zinc-300 mt-2 text-sm">
              You voted for:{" "}
              <span className="font-medium text-emerald-300">
                {positionVotingStatus[position._id]?.votedCandidate?.student?.name || "Unknown"}
              </span>
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={() => handleVoteClick(position)}
          className="mt-4 w-full bg-indigo-600 text-white px-6 py-3 rounded-lg
                   hover:bg-indigo-500 transition-all duration-200 
                   shadow-lg shadow-indigo-900/30 hover:shadow-indigo-700/40
                   active:scale-98 flex items-center justify-center space-x-2"
        >
          <Vote className="w-5 h-5" />
          <span>Cast Your Vote</span>
        </button>
      );
    }

    if (activeTab === "upcoming") {
      return (
        <div className="mt-4 space-y-4">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <h4 className="text-zinc-300 font-medium mb-3 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Registered Candidates</span>
            </h4>
            <ul className="space-y-2">
              {position.candidates.map((candidate) => (
                <li key={candidate._id} 
                    className="flex items-center space-x-2 text-zinc-400 bg-zinc-800/30 
                             rounded-lg p-2 border border-zinc-700/50">
                  <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
                  <span>{candidate.student?.name || "Unnamed Candidate"}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center space-x-2 text-amber-400 bg-amber-500/10 
                         border border-amber-500/20 rounded-lg p-3">
            <Timer className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Voting will be available when the election starts</p>
          </div>
        </div>
      );
    }

    if (activeTab === "done") {
      return (
        <ElectionResults
          electionId={selectedElection._id}
          position={position}
        />
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-zinc-800/60 mb-8">
          <nav className="-mb-px flex space-x-8">
            {["ongoing", "upcoming", "done"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedElection(null);
                }}
                className={`py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200
                           flex items-center space-x-2 ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-700"
                }`}
              >
                {getTabIcon(tab)}
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)} Elections</span>
              </button>
            ))}
          </nav>
        </div>

        {!selectedElection ? (
          loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading elections...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4
                            flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          ) : elections[activeTab].length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
              <Calendar className="w-12 h-12 mb-4 text-zinc-500" />
              <p>No {activeTab} elections available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elections[activeTab].map((election) => (
                <button
                  key={election._id}
                  onClick={() => fetchElectionById(election._id)}
                  className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/60
                           p-6 transition-all duration-200 hover:border-zinc-700/80
                           hover:bg-zinc-800/30 hover:scale-[1.02] active:scale-[0.98]
                           group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <h3 className="text-xl font-semibold mb-3 text-white">{election.title}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(election.startDate)} - {formatDate(election.endDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-zinc-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {election.positions?.length || 0} Positions
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-800/60 flex justify-between items-center">
                    <div className="flex items-center space-x-1 text-indigo-400">
                      <span className="text-sm">View Details</span>
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedElection(null)}
                className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 
                         transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Elections</span>
              </button>
              
              <div className="flex items-center space-x-2 text-zinc-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {formatDate(selectedElection.startDate)} - {formatDate(selectedElection.endDate)}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedElection.title}</h2>
              <p className="text-zinc-400">{selectedElection.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedElection.positions.map((position) => (
                <div
                  key={position._id}
                  className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/60 
                           p-6 transition-all duration-200 hover:border-zinc-700/80"
                >
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-indigo-400" />
                    <span>{position.name}</span>
                  </h3>
                  
                  <p className="mt-2 text-sm text-zinc-400">{position.description}</p>
                  
                  {renderPositionContent(position)}
                </div>
              ))}
            </div>
          </div>
        )}

        {showOTPModal && selectedPosition && (
          <OTPModal
            email={email}
            setEmail={setEmail}
            otp={otp}
            setOtp={setOtp}
            onClose={() => setShowOTPModal(false)}
            onVerify={() => {
              setShowOTPModal(false);
              setShowVotingModal(true);
            }}
          />
        )}

        {showVotingModal && selectedPosition && (
          <VotingModal
            election={selectedElection}
            position={selectedPosition}
            onClose={() => setShowVotingModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default StudentElections;