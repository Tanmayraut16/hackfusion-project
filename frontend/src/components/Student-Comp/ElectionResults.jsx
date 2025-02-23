import React, { useState, useEffect } from "react";
import axios from "axios";
import { Crown } from "lucide-react";

const ElectionResults = ({ electionId, position }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const encodedPositionName = encodeURIComponent(position.name);

        // Using axios properly - no need to check response.ok as axios throws on error status
        const response = await axios.get(
          `http://localhost:3000/api/election/${electionId}/positions/${encodedPositionName}/results`
        );

        setResults(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch results");
        setLoading(false);
      }
    };

    if (electionId && position?.name) {
      fetchResults();
    }
  }, [electionId, position?.name]);

  if (loading) {
    return (
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  // Use position data directly since we already have it
  const totalVotes = position.candidates.reduce(
    (sum, c) => sum + (c.votes || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        <p>Total Votes: {totalVotes}</p>
      </div>
      <div className="space-y-2">
        {position.candidates
          .sort((a, b) => (b.votes || 0) - (a.votes || 0))
          .map((candidate, index) => {
            const percentage =
              totalVotes > 0
                ? (((candidate.votes || 0) / totalVotes) * 100).toFixed(1)
                : 0;

            return (
              <div
                key={candidate._id}
                className={`relative ${
                  index === 0 ? "bg-blue-50" : "bg-gray-50"
                } rounded-lg p-4`}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-blue-200 rounded-l-lg"
                  style={{
                    width: `${percentage}%`,
                    opacity: "0.2",
                    transition: "width 0.3s ease-in-out",
                  }}
                />
                <div className="relative flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {index === 0 && (
                      <div className="text-yellow-500">
                        <Crown className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-lg">
                        {candidate.student?.name || "Unnamed Candidate"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {candidate.student?.department || "No Department"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{candidate.votes || 0}</p>
                    <p className="text-sm text-gray-600">{percentage}%</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ElectionResults;
