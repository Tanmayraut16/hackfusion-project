// StudentDropdown.jsx
import React from "react";

const StudentDropdown = ({ students, value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {students.map((student) => (
        <option key={student._id} value={student._id}>
          {student.name}
        </option>
      ))}
    </select>
  );
};

export default StudentDropdown;
