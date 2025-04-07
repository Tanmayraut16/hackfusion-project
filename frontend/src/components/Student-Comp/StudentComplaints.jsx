import React, { useState, useEffect } from "react";
import axios from "axios";
import { ComplaintForm } from "../complaintsComps/ComplaintForm";
import { ComplaintsList } from "../complaintsComps/ComplaintsList";
import {
  MessageSquare,
  ListFilter,
  PlusCircle,
  UserCircle,
  Globe,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

function StudentComplaints() {
  const currentUser = { name: "John Doe", role: "student" };

  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch complaints data from the backend when the component mounts
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:3000/api/complaint/all")
      .then((response) => {
        setComplaints(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching complaints:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSubmitComplaint = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.post(
        "http://localhost:3000/api/complaint/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.complaint) {
        setComplaints((prevComplaints) => [
          response.data.complaint,
          ...prevComplaints,
        ]);
        setActiveTab("all");
      } else {
        throw new Error(response.data.message || "Failed to submit complaint");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      throw error; // Propagate error to form component
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const isMyComplaint =
      !complaint.isAnonymous && complaint.submitterName === currentUser.name;
    return activeTab === "my" ? isMyComplaint : true;
  });

  return (
    <div className="min-h-screen text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with subtitle */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <AlertTriangle className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
              Complaints Management
            </h1>
            <p className="text-gray-400 mt-1">
              Review and moderate student complaints
            </p>
          </div>
        </div>

        {/* Navigation Cards - Modern card-based navigation instead of buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => setActiveTab("submit")}
            className={`cursor-pointer rounded-xl p-5 flex items-center transition-all ${
              activeTab === "submit"
                ? "bg-indigo-900 bg-opacity-60 border-l-4 border-indigo-500"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                activeTab === "submit" ? "bg-indigo-700" : "bg-gray-700"
              }`}
            >
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-white">Submit Complaint</p>
              <p className="text-sm text-gray-400">
                File a new issue or report
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("all")}
            className={`cursor-pointer rounded-xl p-5 flex items-center transition-all ${
              activeTab === "all"
                ? "bg-indigo-900 bg-opacity-60 border-l-4 border-indigo-500"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                activeTab === "all" ? "bg-indigo-700" : "bg-gray-700"
              }`}
            >
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-white">All Complaints</p>
              <p className="text-sm text-gray-400">
                View all public complaints
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("my")}
            className={`cursor-pointer rounded-xl p-5 flex items-center transition-all ${
              activeTab === "my"
                ? "bg-indigo-900 bg-opacity-60 border-l-4 border-indigo-500"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                activeTab === "my" ? "bg-indigo-700" : "bg-gray-700"
              }`}
            >
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-white">My Complaints</p>
              <p className="text-sm text-gray-400">
                Track your submitted issues
              </p>
            </div>
          </div>
        </div>

        {/* Content area with glass-morphism effect */}
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8">
          {activeTab === "submit" ? (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <ShieldAlert className="h-6 w-6 text-indigo-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">
                  Submit a Complaint
                </h2>
              </div>
              <ComplaintForm onSubmit={handleSubmitComplaint} darkMode={true} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-indigo-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">
                  {activeTab === "my" ? "My Complaints" : "All Complaints"}
                </h2>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-600 rounded-lg">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-300">
                    No complaints found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    {activeTab === "my"
                      ? "You haven't submitted any complaints yet."
                      : "There are no complaints to display."}
                  </p>
                  {activeTab === "my" && (
                    <button
                      onClick={() => setActiveTab("submit")}
                      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                    >
                      Submit a complaint
                    </button>
                  )}
                </div>
              ) : (
                <ComplaintsList
                  complaints={filteredComplaints}
                  currentUser={currentUser}
                  onVoteToReveal={() => {}}
                  darkMode={true}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentComplaints;
