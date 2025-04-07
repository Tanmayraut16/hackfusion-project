import React from "react";
import { X } from "lucide-react";

const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-md relative animate-fadeIn border border-gray-700 shadow-lg shadow-purple-900/20">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-white">{user.role} Details</h2>
        <div className="space-y-4">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <label className="text-sm text-gray-400">Name</label>
            <p className="text-white font-medium">{user.name}</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <label className="text-sm text-gray-400">Email</label>
            <p className="text-white font-medium">{user.email}</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <label className="text-sm text-gray-400">Department</label>
            <p className="text-white font-medium">{user.department}</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <label className="text-sm text-gray-400">Role</label>
            <p className="text-white font-medium">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;