import React, { useState, useEffect } from "react";
import VotingModal from "../../components/Student-Comp/VotingModal";
import ElectionCard from "../../components/Student-Comp/ElectionCard";
import OTPModal from "../../components/Student-Comp/OTPModal";
import ElectionResults from "../../components/Student-Comp/ElectionResults";
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
          "http://localhost:3000/api/election/elections"
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
        `http://localhost:3000/api/election/elections/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched election data:", response.data);
      setSelectedElection(response.data);

      // Fetch voting status immediately after getting election details
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
        `http://localhost:3000/api/election/voters/${electionID}`,
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

  const renderPositionContent = (position) => {
    if (!position.candidates || position.candidates.length === 0) {
      return <p className="text-gray-500">No candidates for this position.</p>;
    }

    if (activeTab === "ongoing") {
      return positionVotingStatus[position._id]?.hasVoted ? (
        <div className="mt-2">
          <p className="text-green-600">
            You have already voted for this position
          </p>
          {positionVotingStatus[position._id]?.votedCandidate && (
            <p className="text-gray-600 mt-1">
              Voted for:{" "}
              {positionVotingStatus[position._id]?.votedCandidate?.student
                ?.name || "Unknown"}
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={() => handleVoteClick(position)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Vote
        </button>
      );
    }

    if (activeTab === "upcoming") {
      return (
        <div>
          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-2">Candidates:</p>
            <ul className="space-y-2">
              {position.candidates.map((candidate) => (
                <li key={candidate._id} className="text-gray-600">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {candidate.student?.name || "Unnamed Candidate"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-yellow-600">
            Voting will be available when the election starts
          </p>
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

    return <p className="text-gray-600">Election has ended</p>;
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {["ongoing", "upcoming", "done"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedElection(null);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Elections
              </button>
            ))}
          </nav>
        </div>

        {!selectedElection ? (
          loading ? (
            <p>Loading elections...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : elections[activeTab].length === 0 ? (
            <p className="text-gray-500">No {activeTab} elections available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elections[activeTab].map((election) => (
                <ElectionCard
                  key={election._id}
                  election={election}
                  type={activeTab}
                  onClick={() => fetchElectionById(election._id)}
                />
              ))}
            </div>
          )
        ) : (
          <div>
            <button
              onClick={() => setSelectedElection(null)}
              className="mb-6 text-blue-600 hover:text-blue-700 flex items-center"
            >
              ← Back to Elections
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedElection.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedElection.positions.map((position) => (
                <div
                  key={position._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    {position.name}
                  </h3>
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
