// StudentDropdown.jsx
import React from "react";

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
        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700">
          {selectedStudent ? selectedStudent.name : "Select a student"}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-gray-200"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="max-h-60 overflow-auto">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  value === student._id ? "bg-indigo-50" : ""
                }`}
                onClick={() => {
                  onChange(student._id);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-gray-500">
                  {student.department}
                </div>
              </div>
            ))}
            {filteredStudents.length === 0 && (
              <div className="px-3 py-2 text-gray-500">No students found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDropdown;
