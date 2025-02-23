import React, { useState, useEffect } from "react";

const ElectionResults = () => {
  const [selectedElection, setSelectedElection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [elections, setElections] = useState([]);

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
        setElections(data.filter((e) => new Date(e.endDate) < now));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const fetchElectionResults = async (electionId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/election/${electionId}/results`
      );
      if (!response.ok) throw new Error("Failed to load election results.");
      const data = await response.json();
      setSelectedElection({ ...data, id: electionId });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderElectionCard = (election) => (
    <div
      key={election._id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
      onClick={() => fetchElectionResults(election._id)}
    >
      <h3 className="text-xl font-semibold mb-4">{election.title}</h3>
      <div className="text-sm text-gray-600 space-y-2">
        <p>Started: {new Date(election.startDate).toLocaleDateString()}</p>
        <p>Ended: {new Date(election.endDate).toLocaleDateString()}</p>
        <p>Positions: {election.positions.length}</p>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <button
        onClick={() => setSelectedElection(null)}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Back to Elections
      </button>

      <h2 className="text-2xl font-bold mb-6">{selectedElection.election}</h2>

      {selectedElection.results.map((position, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md mb-4">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">{position.position}</h3>
            <div className="space-y-4">
              {position.candidates.map((candidate, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    idx === 0 ? "bg-blue-50" : "bg-gray-50"
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-2">
                    {idx === 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <div>
                      <p className="font-medium">
                        {candidate.student?.name || "Unnamed Candidate"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {candidate.student?.department || "No Department"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{candidate.votes} votes</p>
                    <p className="text-sm text-gray-600">
                      {(
                        (candidate.votes /
                          position.candidates.reduce(
                            (sum, c) => sum + c.votes,
                            0
                          )) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {selectedElection ? (
        renderResults()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No completed elections found.
            </p>
          ) : (
            elections.map(renderElectionCard)
          )}
        </div>
      )}
    </div>
  );
};

export default ElectionResults;
