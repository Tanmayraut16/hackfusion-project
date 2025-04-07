import React from "react";
import { Clock4, CheckCircle, XCircle, AlertOctagon } from "lucide-react";

function FacultyDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-gray-100">
      <h2 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Faculty Dashboard
      </h2>

      {/* Complaint Status Section */}
      <div className="mb-10">
        <h3 className="text-lg font-medium mb-6 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 rounded-lg px-4 py-2 inline-block shadow-md">
          Complaint Status
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg border border-gray-700">
            <h4 className="font-medium mb-5 text-gray-300">Complaint Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-md">
                <span className="text-gray-400">Total Complaints</span>
                <span className="font-medium text-white">12</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-md">
                <span className="text-gray-400">Pending</span>
                <span className="font-medium bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">1</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-md">
                <span className="text-gray-400">Approved</span>
                <span className="font-medium bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">7</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-md">
                <span className="text-gray-400">Rejected</span>
                <span className="font-medium bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">4</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg border border-gray-700">
            <h4 className="font-medium mb-5 text-gray-300">Anonymity</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-md">
                <span className="text-gray-400">Anonymous</span>
                <span className="font-medium text-white">11</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-md">
                <span className="text-gray-400">Identified</span>
                <span className="font-medium text-white">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Status Section */}
      <div>
        <h3 className="text-lg font-medium mb-6 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 rounded-lg px-4 py-2 inline-block shadow-md">
          Applications Status
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg border border-gray-700 text-center hover:from-gray-700 hover:to-gray-800 transition-colors">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-600/20 mb-2">
                <Clock4 className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <h4 className="font-medium text-gray-300 mb-2">Pending Reviews</h4>
            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">0</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg border border-gray-700 text-center hover:from-gray-700 hover:to-gray-800 transition-colors">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-600/20 mb-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <h4 className="font-medium text-gray-300 mb-2">Approved</h4>
            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">4</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg border border-gray-700 text-center hover:from-gray-700 hover:to-gray-800 transition-colors">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-red-500/20 to-rose-600/20 mb-2">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <h4 className="font-medium text-gray-300 mb-2">Rejected</h4>
            <p className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">5</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg border border-gray-700 text-center hover:from-gray-700 hover:to-gray-800 transition-colors">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 mb-2">
                <AlertOctagon className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <h4 className="font-medium text-gray-300 mb-2">High Priority</h4>
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">2</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FacultyDashboard;