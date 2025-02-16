import React from 'react';

function FacultyHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Faculty Member</h1>
          <p className="text-xl text-gray-600">This is your dashboard where you can manage your courses, grades, and students.</p>
        </header>

        <main>
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Your Courses</h2>
            <ul className="list-disc pl-6 mt-4 text-gray-700">
              <li>Introduction to Programming</li>
              <li>Advanced Data Structures</li>
              <li>Linear Algebra</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Manage Students</h2>
            <p className="text-gray-700 mt-4">View and manage the students enrolled in your courses.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FacultyHome;
