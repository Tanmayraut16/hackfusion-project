import { Link, useNavigate } from "react-router-dom";
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
    { name: "Applications",path: "/student/application", icon: "ClipboardList" },
    { name :"Budget" ,path :"/student/budget", icon:"BookOpen"}
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
    { name :"Budget" ,path :"/faculty/budget", icon:"BookOpen"}
  ],
  Admin: [
    { name: "Dashboard", path: "/admin/dashboard", icon: "PieChart" },
    { name: "Manage Users", path: "/admin/users", icon: "Users" },
    { name: "Manage Elections", path: "/admin/elections", icon: "Vote" },
    { name: "Manage Booking", path: "/admin/bookings", icon: "BookOpen" },
    {
      name: "Manage Approvals",
      path: "/admin/approvals",
      icon: "ClipboardList",
    },
    { name: "Settings", path: "/admin/settings", icon: "Settings" },
    {
      name: "Manage Application",
      path: "/admin/application",
      icon: "ClipboardList",
    },

    { name :"Budget" ,path :"/admin/budget", icon:"BookOpen"}
  
    
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

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-100 shadow-soft pb-20 h-screen fixed left-0 top-16 transition-all duration-300 ease-in-out flex flex-col justify-between`}
    >
      <nav className="p-4">
        {items.map((item) => {
          const Icon = iconComponents[item.icon];
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-4 p-3 rounded-xl text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-300 mb-2 group"
            >
              <Icon className="w-6 h-6 group-hover:text-blue-500 transition-all duration-300" />
              {isOpen && (
                <span className="font-medium group-hover:text-blue-500 transition-all duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link
          to="/help"
          className="flex items-center gap-4 p-3 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors mb-2 group"
        >
          <HelpCircle className="w-6 h-6 group-hover:text-primary transition-colors" />
          {isOpen && <span className="font-medium">Help & Support</span>}
        </Link>

        <button
          className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors group"
          onClick={handleSignOut}
        >
          <LogOut className="w-6 h-6 group-hover:text-red-500 transition-colors" />
          {isOpen && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
