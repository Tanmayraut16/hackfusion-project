import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmation = ({ onClose, onConfirm, electionName }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">
            Delete Election
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-6 flex">
          <div className="mr-3 flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-gray-300">
            Are you sure you want to delete the record for Election{" "}
            <span className="font-semibold text-white bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {electionName}
            </span>?{" "}
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;