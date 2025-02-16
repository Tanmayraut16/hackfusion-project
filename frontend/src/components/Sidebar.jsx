import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaVoteYea, FaBook, FaClipboard, FaCog, FaUsers, FaChartPie } from "react-icons/fa";

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Define menu items based on role
  const menuItems = {
    Student: [
      { name: "Dashboard", path: "/student/dashboard", icon: <FaChartPie /> },
      { name: "Elections", path: "/student/elections", icon: <FaVoteYea /> },
      { name: "Facility Booking", path: "/student/booking", icon: <FaBook /> },
      { name: "Complaints", path: "/student/complaints", icon: <FaClipboard /> },
    ],
    Faculty: [
      { name: "Dashboard", path: "/faculty/dashboard", icon: <FaChartPie /> },
      { name: "Review Complaints", path: "/faculty/complaints", icon: <FaClipboard /> },
      { name: "Manage Facility Booking", path: "/faculty/booking", icon: <FaBook /> },
    ],
    Admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: <FaChartPie /> },
      { name: "Manage Users", path: "/admin/users", icon: <FaUsers /> },
      { name: "Manage Elections", path: "/admin/elections", icon: <FaVoteYea /> },
      { name: "Manage Approvals", path: "/admin/approvals", icon: <FaClipboard /> },
      { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
    ],
  };

  return (
    <div className={`h-screen bg-gray-900 text-white w-${isOpen ? "64" : "16"} transition-all duration-300 p-4`}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-xl mb-4">
        {isOpen ? "«" : "»"}
      </button>
      <ul>
        {menuItems[role].map((item, index) => (
          <li key={index} className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-md">
            {item.icon}
            {isOpen && <Link to={item.path}>{item.name}</Link>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
