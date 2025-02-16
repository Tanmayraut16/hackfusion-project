import React from 'react';

function AdminHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Admin</h1>
          <p className="text-xl text-gray-600">This is your admin dashboard where you can manage users, roles, and the system.</p>
        </header>

        <main>
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
            <ul className="list-disc pl-6 mt-4 text-gray-700">
              <li>Create new user accounts</li>
              <li>Assign roles (Student, Faculty, Admin)</li>
              <li>Deactivate accounts</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900">System Settings</h2>
            <p className="text-gray-700 mt-4">Configure and manage system-wide settings here.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminHome;
