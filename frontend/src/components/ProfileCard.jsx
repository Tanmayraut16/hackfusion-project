import React from "react";
import { X, Mail, Building2 } from "lucide-react";

export function ProfileCard({ isOpen, onClose, student }) {
  if (!isOpen) return null;
  // Get initials from the student's name
  const initials = student?.name
    ? student.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Profile Content */}
        <div className="flex flex-col items-center">
          {/* Avatar with Initials */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">{initials}</span>
          </div>

          {/* Name and Role */}
          <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
            {student.role}
          </span>

          {/* Details */}
          <div className="w-full mt-6 space-y-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <Mail size={18} className="text-gray-400" />
              <span>{student.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Building2 size={18} className="text-gray-400" />
              <span>{student.department}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
