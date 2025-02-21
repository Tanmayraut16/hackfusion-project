import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import UserList from "./UserList";
import UserModal from "./UserModal";
import { Users, GraduationCap } from "lucide-react";

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
    <div className="flex min-h-screen flex-col bg-gradient-to-r from-blue-50 via-blue-30 to-blue-20">
      <Navbar userName="Admin" />
      <div
        className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-6">
          {!activeView ? (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
                All Users and Faculties
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveView("students")}
                  className="p-4 bg-white rounded-lg shadow transition hover:shadow-lg flex flex-col items-center"
                >
                  <GraduationCap size={28} className="text-blue-600" />
                  <h2 className="mt-2 text-lg font-semibold">All Students</h2>
                  <p className="text-gray-500 text-sm">
                    Manage student accounts
                  </p>
                </button>
                <button
                  onClick={() => setActiveView("faculty")}
                  className="p-4 bg-white rounded-lg shadow transition hover:shadow-lg flex flex-col items-center"
                >
                  <Users size={28} className="text-blue-600" />
                  <h2 className="mt-2 text-lg font-semibold">All Faculty</h2>
                  <p className="text-gray-500 text-sm">
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
                  className="text-blue-600 hover:text-blue-700 mr-4"
                >
                  ← Back
                </button>
                <h1 className="text-2xl font-bold">
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
              <div className="flex justify-center mt-4">
                <button
                  onClick={() =>
                    activeView === "students"
                      ? fetchStudents(studentPage + 1)
                      : fetchFaculty(facultyPage + 1)
                  }
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  {loading ? "Loading..." : "View More"}
                </button>
              </div>
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
