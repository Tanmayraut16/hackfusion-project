import React from "react";
import { Clock4, CheckCircle, XCircle, AlertOctagon } from "lucide-react";

function FacultyDashboard() {
  return (
    <main className="p-8">
      <h2 className="text-xl font-semibold mb-6">FacultyDashboard</h2>

      {/* Complaint Status Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 border border-gray-300 rounded-lg px-4 py-2 inline-block">
          Complaint Status :
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-medium mb-4">Complaint Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Complaints</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-yellow-500">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <span className="font-medium text-green-500">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected</span>
                <span className="font-medium text-red-500">4</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-medium mb-4">Anonymity</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Anonymous</span>
                <span className="font-medium">11</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Identified</span>
                <span className="font-medium">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Status Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 border border-gray-300 rounded-lg px-4 py-2 inline-block">
          Applications status :
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="flex items-center justify-center mb-3">
              <Clock4 className="h-6 w-6 text-yellow-500 mr-2" />
              <h4 className="font-medium">Pending Reviews</h4>
            </div>
            <p className="text-2xl font-semibold text-yellow-500">0</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <h4 className="font-medium">Approved</h4>
            </div>
            <p className="text-2xl font-semibold text-green-500">4</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="flex items-center justify-center mb-3">
              <XCircle className="h-6 w-6 text-red-500 mr-2" />
              <h4 className="font-medium">Rejected</h4>
            </div>
            <p className="text-2xl font-semibold text-red-500">5</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="flex items-center justify-center mb-3">
              <AlertOctagon className="h-6 w-6 text-orange-500 mr-2" />
              <h4 className="font-medium">High Priority</h4>
            </div>
            <p className="text-2xl font-semibold text-orange-500">2</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FacultyDashboard;
