import React from "react";
import { UserPlus } from "lucide-react";

const PendingElection = ({ 
  pendingElection, 
  onAddCandidate, 
  onFinalizeElection, 
  isSubmitting 
}) => {
  return (
    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-white">
          Pending Election: {pendingElection.title}
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Add candidates to positions before finalizing the election
        </p>
      </div>
      <div className="border-t border-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pendingElection.positions.map((position) => (
              <div key={position.id} className="border border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white">
                  {position.name}
                </h4>
                <div className="mt-2 space-y-2">
                  {position.candidates?.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-center space-x-3 bg-gray-700 p-2 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {candidate.department}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => onAddCandidate(position)}
                    className="w-full mt-2 px-4 py-2 bg-indigo-900 text-indigo-100 rounded-md hover:bg-indigo-800 transition-colors flex items-center justify-center"
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
              onClick={onFinalizeElection}
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Finalize Election"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingElection;