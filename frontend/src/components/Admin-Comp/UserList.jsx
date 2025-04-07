import React from "react";
import { Search, Trash2, UserCircle } from "lucide-react";

const UserList = ({
  users,
  title,
  onUserClick,
  searchQuery,
  onSearchChange,
  onRemoveUser,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg shadow-purple-900/10 p-6 border border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-white">{title}</h2>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
        />
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/80 transition-colors bg-gray-800/40"
          >
            <div
              className="flex justify-between items-start cursor-pointer"
              onClick={() => onUserClick(user)}
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-full p-1 mr-3">
                  <UserCircle size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <span className="text-sm px-2 py-1 rounded-full bg-gray-700 text-gray-300">{user.department}</span>
            </div>
            <div className="flex justify-end items-center mt-3 pt-2 border-t border-gray-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveUser(user._id);
                }}
                className="flex items-center text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                <Trash2 size={16} className="mr-1" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;