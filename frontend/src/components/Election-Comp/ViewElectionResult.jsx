import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Crown, 
  AlertCircle, 
  ChevronDown, 
  Download, 
  Printer, 
  RefreshCcw, 
  UserCheck, 
  BarChart4,
  Award,
  X
} from "lucide-react";

const ElectionResultModal = ({ electionId, position, isOpen, onClose }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Only fetch when modal is open
    if (isOpen && electionId && position?.name) {
      fetchResults();
    }
  }, [isOpen, electionId, position?.name]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const encodedPositionName = encodeURIComponent(position.name);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/election/${electionId}/positions/${encodedPositionName}/results`
      );
      setResults(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching results:", err);
      setError(err.response?.data?.message || "Failed to fetch election results");
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchResults();
  };

  const handleExportCSV = () => {
    if (!position || !position.candidates) return;
    
    // Create CSV content
    const headers = ["Rank", "Name", "Department", "Votes", "Percentage"];
    const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
    
    const rows = position.candidates
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .map((candidate, index) => {
        const percentage = totalVotes > 0
          ? ((candidate.votes || 0) / totalVotes * 100).toFixed(1)
          : 0;
        
        return [
          index + 1,
          candidate.student?.name || "Unnamed Candidate",
          candidate.student?.department || "No Department",
          candidate.votes || 0,
          `${percentage}%`
        ];
      });
    
    const csvContent = [
      `Election: ${results?.election?.title || "Unknown Election"}`,
      `Position: ${position.name}`,
      `Total Votes: ${totalVotes}`,
      `Date: ${new Date().toLocaleDateString()}`,
      "",
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${position.name.replace(/\s+/g, "_")}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle clicks outside the modal to close it
  const handleClickOutside = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  // Calculate total votes
  const totalVotes = position?.candidates?.reduce(
    (sum, c) => sum + (c.votes || 0),
    0
  ) || 0;

  const voterTurnout = results?.voterStats?.totalEligible 
    ? ((totalVotes / results.voterStats.totalEligible) * 100).toFixed(1)
    : "N/A";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay overflow-y-auto p-4" 
      onClick={handleClickOutside}
    >
      <div 
        className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-4xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Modal Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-400">Loading election results...</p>
          </div>
        ) : error ? (
          <div className="border border-red-900 p-8 rounded-xl">
            <div className="flex items-center space-x-3 text-red-400 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-medium">Error Loading Results</h3>
            </div>
            <p className="text-red-300">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-6 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md flex items-center space-x-2"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Award className="h-6 w-6 mr-2 text-indigo-400" />
                  {position.name} Results
                </h2>
                <p className="text-gray-400 mt-1">
                  Election: {results?.election?.title || "Unknown Election"}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-400 hover:text-indigo-400 transition-colors rounded-md hover:bg-gray-800"
                  title="Refresh Results"
                >
                  <RefreshCcw className="h-5 w-5" />
                </button>
                <button
                  onClick={handleExportCSV}
                  className="p-2 text-gray-400 hover:text-indigo-400 transition-colors rounded-md hover:bg-gray-800"
                  title="Export as CSV"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 text-gray-400 hover:text-indigo-400 transition-colors rounded-md hover:bg-gray-800"
                  title="Print Results"
                >
                  <Printer className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Total Votes Cast</p>
                <p className="text-2xl font-bold text-white">{totalVotes}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Eligible Voters</p>
                <p className="text-2xl font-bold text-white">
                  {results?.voterStats?.totalEligible || "N/A"}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Voter Turnout</p>
                <p className="text-2xl font-bold text-white">{voterTurnout}%</p>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-300 flex items-center">
                <BarChart4 className="h-5 w-5 mr-2 text-indigo-400" />
                Candidate Results
              </h3>
              
              <div className="space-y-3">
                {position.candidates
                  .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                  .map((candidate, index) => {
                    const percentage =
                      totalVotes > 0
                        ? ((candidate.votes || 0) / totalVotes * 100).toFixed(1)
                        : 0;
                        
                    return (
                      <div
                        key={candidate._id}
                        className={`relative ${
                          index === 0 
                            ? "bg-gradient-to-r from-indigo-900 to-indigo-800 border-indigo-700" 
                            : "bg-gray-800 border-gray-700"
                        } rounded-lg p-4 border transition-all hover:border-indigo-600`}
                      >
                        <div
                          className={`absolute left-0 top-0 h-full rounded-l-lg ${
                            index === 0 ? "bg-indigo-600" : "bg-indigo-500"
                          }`}
                          style={{
                            width: `${percentage}%`,
                            opacity: "0.2",
                            transition: "width 0.5s ease-in-out",
                          }}
                        />
                        
                        <div className="relative flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                              {index === 0 ? (
                                <Crown className="h-6 w-6 text-yellow-400" />
                              ) : (
                                <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                                  <span className="text-gray-300 font-medium">{index + 1}</span>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <p className="font-semibold text-lg text-gray-200">
                                {candidate.student?.name || candidate.name || "Unnamed Candidate"}
                              </p>
                              <p className="text-sm text-gray-400">
                                {candidate.student?.department || candidate.department || "No Department"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-200">
                              {candidate.votes || 0}
                            </p>
                            <p className="text-sm text-gray-400">{percentage}%</p>
                          </div>
                        </div>
                        
                        {index === 0 && (
                          <div className="mt-3 text-sm text-yellow-300 flex items-center">
                            <UserCheck className="h-4 w-4 mr-1" />
                            <span>Winner</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Advanced Statistics Toggle */}
            <div className="border-t border-gray-800 pt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm font-medium"
              >
                <ChevronDown 
                  className={`h-4 w-4 mr-1 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
                />
                {showDetails ? "Hide Details" : "Show Advanced Statistics"}
              </button>
              
              {showDetails && (
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-md font-medium text-gray-300 mb-3">Voting Demographics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Gender Distribution</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">Male</span>
                            <span className="text-gray-300 text-sm">
                              {results?.voterStats?.genderDistribution?.male || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">Female</span>
                            <span className="text-gray-300 text-sm">
                              {results?.voterStats?.genderDistribution?.female || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">Other/Undisclosed</span>
                            <span className="text-gray-300 text-sm">
                              {results?.voterStats?.genderDistribution?.other || 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Age Distribution</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">18-22</span>
                            <span className="text-gray-300 text-sm">
                              {results?.voterStats?.ageDistribution?.["18-22"] || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">23-26</span>
                            <span className="text-gray-300 text-sm">
                              {results?.voterStats?.ageDistribution?.["23-26"] || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">27+</span>
                            <span className="text-gray-300 text-sm">
                              {results?.voterStats?.ageDistribution?.["27+"] || 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-md font-medium text-gray-300 mb-3">Voting Trends</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">By Department</p>
                        <div className="mt-2 space-y-2">
                          {results?.voterStats?.departmentBreakdown ? 
                            Object.entries(results.voterStats.departmentBreakdown)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 3)
                              .map(([dept, percent]) => (
                                <div key={dept} className="flex justify-between items-center">
                                  <span className="text-gray-300 text-sm">{dept}</span>
                                  <span className="text-gray-300 text-sm">{percent}%</span>
                                </div>
                              ))
                            : 
                            <p className="text-gray-500 text-sm italic">No department data available</p>
                          }
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">By Time of Day</p>
                        <div className="mt-2 space-y-2">
                          {results?.voterStats?.timeOfDayBreakdown ? 
                            Object.entries(results.voterStats.timeOfDayBreakdown)
                              .map(([time, percent]) => (
                                <div key={time} className="flex justify-between items-center">
                                  <span className="text-gray-300 text-sm">{time}</span>
                                  <span className="text-gray-300 text-sm">{percent}%</span>
                                </div>
                              ))
                            : 
                            <p className="text-gray-500 text-sm italic">No time data available</p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md"
                onClick={handleExportCSV}
              >
                Export Results
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ElectionResultModal;