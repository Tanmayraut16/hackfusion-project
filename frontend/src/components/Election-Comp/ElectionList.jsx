import React from "react";
import { Calendar, ChevronRight, Award, Edit, Trash2, BarChart3 } from "lucide-react";

const ElectionList = ({
  isLoading,
  elections,
  selectedPositionDetails,
  onPositionClick,
  onEditElection,
  onDeleteElection,
  onViewResults,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-300">Loading elections...</div>
        </div>
      </div>
    );
  }

  if (elections.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg overflow-hidden rounded-xl border border-gray-800 ">
        <div className="text-center py-16 px-4">
          <div className="mb-4 flex justify-center">
            <Calendar className="h-12 w-12 text-indigo-400 opacity-70" />
          </div>
          <p className="text-gray-300 font-medium">No elections found</p>
          <p className="text-gray-400 mt-2">
            Create your first election to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-700">
        {elections.map((election) => (
          <li
            key={election._id}
            className="hover:bg-gray-700 transition-colors"
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-white truncate">
                    {election.title}
                  </h3>
                  <div className="mt-1 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-400">
                      {new Date(election.startDate).toLocaleDateString()} -{" "}
                      {new Date(election.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {/* Add Edit and Delete buttons */}
                <div className="flex space-x-2">
                  {election.category === "past" && (
                    <button
                      onClick={() => onViewResults(election)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 
                transition-colors duration-200 flex items-center space-x-1.5 text-sm"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>View Results</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditElection(election);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElection(election);
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="size-6" />
                  </button>
                </div>
              </div>

              {/* Positions and Candidates Display */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center">
                  <Award className="h-4 w-4 mr-2 text-indigo-400" />
                  Positions
                </h4>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {election.positions.map((position) => (
                    <div key={position._id || position.name}>
                      <div
                        onClick={() => onPositionClick(position)}
                        className={`rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                          selectedPositionDetails?.name === position.name
                            ? "bg-gradient-to-br from-indigo-900 to-indigo-800 border border-indigo-700 shadow-lg"
                            : "border border-gray-700 hover:border-indigo-600 hover:shadow-md"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h5
                            className={`font-medium text-lg ${
                              selectedPositionDetails?.name === position.name
                                ? "text-white"
                                : "text-gray-200"
                            }`}
                          >
                            {position.name}
                          </h5>
                          <ChevronRight
                            className={`h-5 w-5 transition-transform ${
                              selectedPositionDetails?.name === position.name
                                ? "text-indigo-400 rotate-90"
                                : "text-gray-500"
                            }`}
                          />
                        </div>

                        {selectedPositionDetails?.name === position.name && (
                          <div className="mt-4 space-y-3">
                            <h6 className="text-sm font-medium text-indigo-300 flex items-center">
                              Candidates:
                            </h6>
                            {position.candidates &&
                            position.candidates.length > 0 ? (
                              position.candidates.map((candidate) => (
                                <div
                                  key={candidate._id || candidate.student?._id}
                                  className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 backdrop-blur-sm hover:border-indigo-700 transition-colors"
                                >
                                  <div className="flex items-center space-x-3">
                                    {candidate.photo_url ? (
                                      <img
                                        src={candidate.photo_url}
                                        alt={
                                          candidate.student?.name ||
                                          candidate.name
                                        }
                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/50"
                                      />
                                    ) : (
                                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                        <span className="text-white font-medium text-lg">
                                          {(
                                            candidate.student?.name ||
                                            candidate.name ||
                                            ""
                                          ).charAt(0)}
                                        </span>
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-white">
                                        {candidate.student?.name ||
                                          candidate.name}
                                      </p>
                                      <p className="text-xs text-indigo-300">
                                        {candidate.student?.department ||
                                          candidate.department}
                                      </p>
                                      {candidate.bio && (
                                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                                          {candidate.bio}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
                                <p className="text-sm text-gray-400">
                                  No candidates yet
                                </p>
                              </div>
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
    </div>
  );
};

export default ElectionList;
