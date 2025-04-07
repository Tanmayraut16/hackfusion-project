import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import UserList from "./UserList";
import UserModal from "./UserModal";
import { Users, GraduationCap, ArrowLeft } from "lucide-react";

const AdminUsers = () => {
  const [activeView, setActiveView] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [studentPage, setStudentPage] = useState(1);
  const [facultyPage, setFacultyPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeView === "students") {
      fetchStudents(1);
    } else if (activeView === "faculty") {
      fetchFaculty(1);
    }
  }, [activeView]);

  const fetchStudents = async (page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/details/students?page=${page}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents((prev) =>
        page === 1 ? res.data.data : [...prev, ...res.data.data]
      );
      setStudentPage(page);
    } catch (error) {
      console.error("Error fetching students", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async (page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/details/faculty?page=${page}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFaculty((prev) =>
        page === 1 ? res.data.data : [...prev, ...res.data.data]
      );
      setFacultyPage(page);
    } catch (error) {
      console.error("Error fetching faculty", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        activeView === "students"
          ? `http://localhost:3000/api/details/students/${userId}`
          : `http://localhost:3000/api/details/faculty/${userId}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the user from the state
      if (activeView === "students") {
        setStudents((prev) => prev.filter((user) => user._id !== userId));
      } else {
        setFaculty((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Error removing user", error);
    }
  };

  // Optional: filter users based on searchQuery
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = faculty.filter(
    (facultyMember) =>
      facultyMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facultyMember.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Admin" />
      <div
        className="flex-1  px-4 py-8"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-6">
          {!activeView ? (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left text-white">
                User Management
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => setActiveView("students")}
                  className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg shadow-purple-900/10 transition hover:shadow-purple-900/30 hover:translate-y-[-4px] flex flex-col items-center border border-gray-700"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full mb-3">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-white">All Students</h2>
                  <p className="text-gray-400 text-sm">
                    Manage student accounts
                  </p>
                </button>
                <button
                  onClick={() => setActiveView("faculty")}
                  className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg shadow-purple-900/10 transition hover:shadow-purple-900/30 hover:translate-y-[-4px] flex flex-col items-center border border-gray-700"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-full mb-3">
                    <Users size={24} className="text-white" />
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-white">All Faculty</h2>
                  <p className="text-gray-400 text-sm">
                    Manage faculty accounts
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setActiveView(null)}
                  className="flex items-center text-purple-400 hover:text-purple-300 mr-4 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-1" />
                  Back
                </button>
                <h1 className="text-2xl font-bold text-white">
                  {activeView === "students" ? "All Students" : "All Faculty"}
                </h1>
              </div>
              <UserList
                users={
                  activeView === "students" ? filteredStudents : filteredFaculty
                }
                title={activeView === "students" ? "Students" : "Faculty"}
                onUserClick={setSelectedUser}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onRemoveUser={handleRemoveUser}
              />
              {(activeView === "students" ? filteredStudents : filteredFaculty).length > 0 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() =>
                      activeView === "students"
                        ? fetchStudents(studentPage + 1)
                        : fetchFaculty(facultyPage + 1)
                    }
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          )}
          {selectedUser && (
            <UserModal
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;