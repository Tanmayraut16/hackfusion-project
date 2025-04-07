import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  PieChart,
  Vote,
  BookOpen,
  ClipboardList,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const menuItems = {
  Student: [
    { name: "Dashboard", path: "/student/dashboard", icon: "PieChart" },
    { name: "Elections", path: "/student/elections", icon: "Vote" },
    {
      name: "Report Cheating",
      path: "/student/report-cheating",
      icon: "ClipboardList",
    },
    { name: "Facility Booking", path: "/student/booking", icon: "BookOpen" },
    { name: "Complaints", path: "/student/complaints", icon: "ClipboardList" },
    { name: "Applications", path: "/student/application", icon: "ClipboardList" },
    { name: "Budget", path: "/student/budget", icon: "BookOpen" }
  ],
  Faculty: [
    { name: "Dashboard", path: "/faculty/dashboard", icon: "PieChart" },
    {
      name: "Review Complaints",
      path: "/faculty/complaints",
      icon: "ClipboardList",
    },
    {
      name: "Report Cheating",
      path: "/faculty/report-cheating",
      icon: "ClipboardList",
    },
    {
      name: "Manage Facility Booking",
      path: "/faculty/booking",
      icon: "BookOpen",
    },
    {
      name: "Manage Application",
      path: "/faculty/application",
      icon: "ClipboardList",
    },
    { name: "Budget", path: "/faculty/budget", icon: "BookOpen" }
  ],
  Admin: [
    { name: "Dashboard", path: "/admin/dashboard", icon: "PieChart" },
    { name: "Manage Users", path: "/admin/users", icon: "Users" },
    { name: "Manage Elections", path: "/admin/elections", icon: "Vote" },
    { name: "Manage Facility", path: "/admin/bookings", icon: "BookOpen" },
    {
      name: "Manage Approvals",
      path: "/admin/approvals",
      icon: "ClipboardList",
    },
    {
      name: "Review Complaints",
      path: "/admin/complaints",
      icon: "ClipboardList",
    },
    {
      name: "Manage Application",
      path: "/admin/application",
      icon: "ClipboardList",
    },
    { name: "Budget", path: "/admin/budget", icon: "BookOpen" },
    { name: "Settings", path: "/admin/settings", icon: "Settings" },
  ],
  Doctor: [
    { name: "Dashboard", path: "/doctor/dashboard", icon: "PieChart" },
    {
      name: "Leave Application",
      path: "/doctor/leave-application",
      icon: "Users",
    },
  ],
};

const iconComponents = {
  PieChart,
  Vote,
  BookOpen,
  ClipboardList,
  Users,
  Settings,
};

const Sidebar = ({ role, isOpen }) => {
  const items = menuItems[role] || [];
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentPath = location.pathname;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gray-900 border-r border-gray-800 shadow-lg pb-20 h-screen fixed left-0 top-16 transition-all duration-300 ease-in-out flex flex-col justify-between`}
    >
      <nav className="p-4">
        {items.map((item) => {
          const Icon = iconComponents[item.icon];
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 mb-2 group ${
                isActive 
                  ? "bg-indigo-900/50 text-indigo-400" 
                  : "text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30"
              }`}
            >
              <Icon className={`w-6 h-6 transition-all duration-300 ${
                isActive ? "text-indigo-400" : "group-hover:text-indigo-400"
              }`} />
              {isOpen && (
                <span className={`font-medium transition-all duration-300 ${
                  isActive ? "text-indigo-400" : "group-hover:text-indigo-400"
                }`}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link
          to="/help"
          className={`flex items-center gap-4 p-3 rounded-xl transition-colors mb-2 group ${
            currentPath === "/help"
              ? "bg-indigo-900/50 text-indigo-400"
              : "text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30"
          }`}
        >
          <HelpCircle className={`w-6 h-6 transition-colors ${
            currentPath === "/help" ? "text-indigo-400" : "group-hover:text-indigo-400"
          }`} />
          {isOpen && (
            <span className={`font-medium ${
              currentPath === "/help" ? "text-indigo-400" : ""
            }`}>
              Help & Support
            </span>
          )}
        </Link>

        <button
          className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-colors group"
          onClick={handleSignOut}
        >
          <LogOut className="w-6 h-6 group-hover:text-red-400 transition-colors" />
          {isOpen && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;