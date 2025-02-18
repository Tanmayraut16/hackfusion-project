import { Link } from "react-router-dom";
import { PieChart, Vote, BookOpen, ClipboardList, Users, Settings, HelpCircle,
  LogOut } from "lucide-react";

const menuItems = {
  Student: [
    { name: "Dashboard", path: "/student/dashboard", icon: "PieChart" },
    { name: "Elections", path: "/student/elections", icon: "Vote" },
    { name: "Facility Booking", path: "/student/booking", icon: "BookOpen" },
    { name: "Complaints", path: "/student/complaints", icon: "ClipboardList" },
  ],
  Faculty: [
    { name: "Dashboard", path: "/faculty/dashboard", icon: "PieChart" },
    { name: "Review Complaints", path: "/faculty/complaints", icon: "ClipboardList" },
    { name: "Manage Facility Booking", path: "/faculty/booking", icon: "BookOpen" },
  ],
  Admin: [
    { name: "Dashboard", path: "/admin/dashboard", icon: "PieChart" },
    { name: "Manage Users", path: "/admin/users", icon: "Users" },
    { name: "Manage Elections", path: "/admin/elections", icon: "Vote" },
    { name: "Manage Approvals", path: "/admin/approvals", icon: "ClipboardList" },
    { name: "Settings", path: "/admin/settings", icon: "Settings" },
  ],
  Doctor: [
    { name: "Dashboard", path: "/doctor/dashboard", icon: "PieChart" },
    { name: "Leave Application", path: "/doctor/leave-application", icon: "Users" },
  ],
};

const iconComponents = { PieChart, Vote, BookOpen, ClipboardList, Users, Settings };

const Sidebar = ({ role, isOpen }) => {
  const items = menuItems[role] || [];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-100 shadow-soft pb-20 h-screen fixed left-0 top-16 transition-all duration-300 ease-in-out flex flex-col justify-between`}>
      <nav className="p-4">
        {items.map((item) => {
          const Icon = iconComponents[item.icon];
          return (
            <Link
              key={item.path}
              to={item.path} // Use Link instead of <a href>
              className="flex items-center gap-4 p-3 rounded-xl text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-300 mb-2 group"
            >
              <Icon className="w-6 h-6 group-hover:text-blue-500 transition-all duration-300" />
              {isOpen && (
                <span className="font-medium group-hover:text-blue-500 transition-all duration-300">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <a
          href="/help"
          className="flex items-center gap-4 p-3 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors mb-2 group"
        >
          <HelpCircle className="w-6 h-6 group-hover:text-primary transition-colors" />
          {isOpen && <span className="font-medium">Help & Support</span>}
          
        </a>
        <button
          className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors group"
        >
          <LogOut className="w-6 h-6 group-hover:text-red-500 transition-colors" />
          {isOpen && <span className="font-medium">Sign Out</span>}
          
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
