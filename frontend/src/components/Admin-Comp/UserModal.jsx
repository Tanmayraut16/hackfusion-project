import React from "react";
import { X } from "lucide-react";

const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">{user.role} Details</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="text-gray-800 font-medium">{user.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="text-gray-800 font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Department</label>
            <p className="text-gray-800 font-medium">{user.department}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="text-gray-800 font-medium">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
