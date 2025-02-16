import React from "react";
import Sidebar from "../../components/Sidebar"; 

function StudentHome() {
  return (
    <div className="flex">
      {/* Sidebar for Students */}
      <Sidebar role="Student" />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Student</h1>
            <p className="text-xl text-gray-600">
              This is your dashboard where you can view your courses and grades.
            </p>
          </header>

          <main>
            {/* Courses Section */}
            <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Your Courses</h2>
              <ul className="list-disc pl-6 mt-4 text-gray-700">
                <li>Mathematics 101</li>
                <li>History of College</li>
                <li>Science Fundamentals</li>
              </ul>
            </div>

            {/* Grades Section */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900">Your Grades</h2>
              <p className="text-gray-700 mt-4">
                Your grades will appear here after assessments.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
