import React from "react";
import { Menu, User, Bell } from "lucide-react";

const Navbar = ({ toggleSidebar, userName }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 shadow-soft z-10">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text ">
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
            <button className="p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
