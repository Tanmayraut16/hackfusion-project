import React, { useState } from "react";
import { ChevronDown, User, Search } from "lucide-react";

const StudentDropdown = ({ students, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStudent = students.find((s) => s._id === value);

  return (
    <div className="relative">
      <div
        className="w-full border border-gray-700 rounded-lg shadow-sm py-3 px-4 bg-gray-800 flex justify-between items-center cursor-pointer hover:border-purple-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {selectedStudent ? (
            <>
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-full p-1 mr-3">
                <User size={16} className="text-white" />
              </div>
              <span className="text-white">{selectedStudent.name}</span>
            </>
          ) : (
            <span className="text-gray-400">Select a student</span>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-3 bg-gray-900 border-b border-gray-700 rounded-t-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-700 ${
                  value === student._id ? "bg-gray-700" : ""
                } border-l-2 ${
                  value === student._id ? "border-purple-500" : "border-transparent"
                }`}
                onClick={() => {
                  onChange(student._id);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                <div className="font-medium text-white">{student.name}</div>
                <div className="text-sm text-gray-400">
                  {student.department}
                </div>
              </div>
            ))}
            {filteredStudents.length === 0 && (
              <div className="px-4 py-3 text-gray-400 italic">No students found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDropdown;