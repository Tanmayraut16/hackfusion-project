import React from "react";
import { Search, Trash2 } from "lucide-react";

const UserList = ({
  users,
  title,
  onUserClick,
  searchQuery,
  onSearchChange,
  onRemoveUser,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>

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
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div
              className="flex justify-between items-start cursor-pointer"
              onClick={() => onUserClick(user)}
            >
              <div>
                <h3 className="font-medium text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-sm text-gray-500">{user.department}</span>
            </div>
            <div className="flex justify-end items-center mt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveUser(user._id);
                }}
                className="flex items-center text-red-500 hover:text-red-700 text-sm transition-colors"
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
