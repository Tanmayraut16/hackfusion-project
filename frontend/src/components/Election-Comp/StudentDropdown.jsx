import React, { useState } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

const StudentDropdown = ({ students, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedStudent = students.find((student) => student._id === value);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative mt-1">
      <button
        type="button"
        className="relative w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate text-white">
          {selectedStudent ? selectedStudent.name : "Select a student"}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none">
          <div className="sticky top-0 bg-gray-800 px-3 py-2">
            <div className="flex items-center bg-gray-700 rounded-md px-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="ml-2 block w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 text-sm"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 ${
                  value === student._id ? "bg-indigo-600 text-white" : "text-gray-200"
                }`}
                onClick={() => {
                  onChange(student._id);
                  setIsOpen(false);
                }}
              >
                <span className="block truncate">{student.name}</span>
                {value === student._id && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <Check className="h-5 w-5 text-white" />
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-400 px-3 py-2 text-sm">No students found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDropdown;
