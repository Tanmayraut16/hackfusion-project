import React from "react";
import { X, Mail, Building2, GraduationCap, Calendar, User } from "lucide-react";

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
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-md rounded-2xl relative animate-fadeIn overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1f2937 0%, #111827 100%)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Decorative gradient accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-24 opacity-90" 
          style={{
            background: "linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)"
          }}
        ></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white hover:text-gray-200 transition-colors z-10 bg-gray-800 bg-opacity-50 rounded-full p-1"
        >
          <X size={20} />
        </button>

        {/* Profile Content */}
        <div className="flex flex-col items-center p-6 pt-20 relative z-0">
          {/* Avatar with Initials */}
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4 border-4 border-gray-900"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)"
            }}
          >
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>

          {/* Name and Role */}
          <h2 className="text-2xl font-bold text-white">{student.name}</h2>
          <div 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2"
            style={{
              background: "linear-gradient(90deg, #4f46e5 0%, #818cf8 100%)",
              boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)"
            }}
          >
            <User size={14} className="mr-1 text-white" />
            <span className="text-white">{student.role}</span>
          </div>

          {/* Details Card */}
          <div className="w-full mt-8 p-5 rounded-xl bg-gray-800 bg-opacity-50 space-y-5 backdrop-blur-sm">
            <h3 className="text-gray-300 text-sm uppercase tracking-wider mb-4 font-medium">Contact Information</h3>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="p-2 rounded-lg bg-gray-700">
                <Mail size={18} className="text-indigo-400" />
              </div>
              <span>{student.email}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="p-2 rounded-lg bg-gray-700">
                <Building2 size={18} className="text-indigo-400" />
              </div>
              <span>{student.department}</span>
            </div>

            {student.graduationYear && (
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 rounded-lg bg-gray-700">
                  <Calendar size={18} className="text-indigo-400" />
                </div>
                <span>Class of {student.graduationYear}</span>
              </div>
            )}

            {student.major && (
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 rounded-lg bg-gray-700">
                  <GraduationCap size={18} className="text-indigo-400" />
                </div>
                <span>{student.major}</span>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <button 
            className="w-full mt-6 py-3 rounded-xl text-white font-medium"
            style={{
              background: "linear-gradient(90deg, #4f46e5 0%, #818cf8 100%)",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
            }}
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}