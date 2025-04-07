import React from "react";
import StudentDropdown from "./StudentDropdown";

const AddCandidateModal = ({
  students,
  candidateForm,
  setCandidateForm,
  selectedPosition,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Add Candidate for {selectedPosition?.name}
        </h3>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="student"
              className="block text-sm font-medium text-gray-300"
            >
              Student
            </label>
            <StudentDropdown
              students={students}
              value={candidateForm.student}
              onChange={(studentId) => {
                const selectedStudent = students.find(
                  (s) => s._id === studentId
                );
                setCandidateForm((prev) => ({
                  ...prev,
                  student: studentId,
                  name: selectedStudent?.name || "",
                  department: selectedStudent?.department || "",
                }));
              }}
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-300"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={candidateForm.bio}
              onChange={(e) =>
                setCandidateForm((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              rows={3}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Brief description of the candidate"
            />
          </div>

          <div>
            <label
              htmlFor="photo_url"
              className="block text-sm font-medium text-gray-300"
            >
              Photo URL
            </label>
            <input
              type="url"
              id="photo_url"
              value={candidateForm.photo_url}
              onChange={(e) =>
                setCandidateForm((prev) => ({
                  ...prev,
                  photo_url: e.target.value,
                }))
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter photo URL"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;