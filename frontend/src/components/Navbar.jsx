import React, { useState, useEffect } from "react";
import { Menu, User, Bell } from "lucide-react";
import { ProfileCard } from "./ProfileCard"; // adjust the path as necessary
import { jwtDecode } from "jwt-decode"; // Default import
import axios from "axios";

const Navbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [student, setStudent] = useState({});

  const handleProfileOpen = () => {
    setIsProfileOpen(true);
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      try {
        // Decode the tok
        // en to extract the user ID.
        let userId = "";
        const decoded = jwtDecode(token);
        if (decoded.role === "student") {
          userId = decoded.studentId;
        } else if (decoded.role === "faculty") {
          userId = decoded.id;
        }

        fetchUserDetails(userId, decoded.role);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const fetchUserDetails = async (userId, role) => {
    console.log(userId);
    try {
      let endpoint = "";
      // Adjust the endpoint URL to remove the colon and ensure userId is correctly passed.
      switch (role) {
        case "student":
          endpoint = `http://localhost:3000/api/student-login/profile/${userId}`;
          break;
        case "faculty":
          endpoint = `http://localhost:3000/api/faculty-login/profile/${userId}`;
          break;
        case "admin":
          endpoint = `http://localhost:3000/api/admin/`;
          break;
        default:
          endpoint = `http://localhost:3000/api/`;
      }
      const response = await axios.get(endpoint);
      const data = response.data;
      setUserName(data.name);
      setStudent(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 shadow-soft z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
              Campus Portal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <span className="text-sm font-medium text-gray-700">
                {userName}
              </span>
              <button
                onClick={handleProfileOpen}
                className="p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <ProfileCard
        isOpen={isProfileOpen}
        onClose={handleProfileClose}
        student={student}
      />
    </>
  );
};

export default Navbar;
