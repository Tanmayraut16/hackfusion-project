import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Calendar,
  Clock,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import ElectionList from "../../components/Election-Comp/ElectionList";
import PendingElection from "../../components/Election-Comp/PendingElection";
import NewElectionModal from "../../components/Election-Comp/NewElectionModal";
import AddCandidateModal from "../../components/Election-Comp/AddCandidateModal";
import { fetchAllElections } from "../../components/Election-Comp/electionService";
import { fetchAllStudents } from "../../components/Election-Comp/studentService";

function AdminElectionManage() {
  const [showNewElectionModal, setShowNewElectionModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPositionDetails, setSelectedPositionDetails] = useState(null);
  const [editingElectionId, setEditingElectionId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    category: "upcoming",
    positions: [{ name: "President", candidates: [] }],
  });
  const [pendingElection, setPendingElection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    department: "",
    bio: "",
    photo_url: "",
    student: "",
  });
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, electionsData] = await Promise.all([
          fetchAllStudents(),
          fetchAllElections(),
        ]);
        setStudents(studentsData);
        setElections(electionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePositionClick = (position) => {
    setSelectedPositionDetails(
      selectedPositionDetails?.name === position.name ? null : position
    );
  };

  const resetForm = () => {
    setFormData({
      title: "",
      startDate: "",
      endDate: "",
      category: "upcoming",
      positions: [{ name: "President", candidates: [] }],
    });
    setError(null);
  };

  const handleCreateElection = (e) => {
    e.preventDefault();
    const newPendingElection = {
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      category: formData.category,
      positions: formData.positions.map((pos) => ({
        ...pos,
        id: Math.random().toString(36).substr(2, 9),
      })),
    };

    setPendingElection(newPendingElection);
    setShowNewElectionModal(false);
    resetForm();
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();

    if (!selectedPosition) return;

    const candidateExists = selectedPosition.candidates?.some(
      (candidate) => candidate.student === candidateForm.student
    );

    if (candidateExists) {
      alert("This student is already added as a candidate for this position.");
      return;
    }

    const updatedPositions = pendingElection.positions.map((pos) => {
      if (pos.id === selectedPosition.id) {
        return {
          ...pos,
          candidates: [
            ...(pos.candidates || []),
            {
              ...candidateForm,
              id: Math.random().toString(36).substr(2, 9),
            },
          ],
        };
      }
      return pos;
    });

    setPendingElection((prev) => ({
      ...prev,
      positions: updatedPositions,
    }));

    setCandidateForm({
      name: "",
      department: "",
      bio: "",
      photo_url: "",
      student: "",
    });
    setShowCandidateModal(false);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const formattedData = {
        title: pendingElection.title,
        startDate: pendingElection.startDate,
        endDate: pendingElection.endDate,
        positions: pendingElection.positions.map((pos) => ({
          name: pos.name,
          candidates: pos.candidates.map((candidate) => ({
            name: candidate.name,
            department: candidate.department,
            bio: candidate.bio,
            photo_url: candidate.photo_url,
            student: candidate.student,
          })),
        })),
      };

      await axios.post("http://localhost:3000/api/election/", formattedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedElections = await fetchAllElections();
      setElections(updatedElections);
      setSuccessMessage("Election created successfully!");
      setPendingElection(null);
    } catch (error) {
      console.error("Error creating election:", error);
      setError(error.response?.data?.message || "Failed to create election");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditElection = (election) => {
    // Populate the form with election data
    setFormData({
      title: election.title,
      startDate: election.startDate.split("T")[0], // Format date properly
      endDate: election.endDate.split("T")[0], // Format date properly
      category: election.category || "upcoming",
      positions: election.positions.map((pos) => ({
        name: pos.name,
        _id: pos._id,
        candidates: pos.candidates || [],
      })),
    });

    // Set editing mode
    setEditingElectionId(election._id);
    setShowNewElectionModal(true);
  };

  const handleDeleteElection = async (election) => {
    if (
      window.confirm(
        `Are you sure you want to delete the election "${election.title}"?`
      )
    ) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(
          `http://localhost:3000/api/election/${election._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the elections list
        setElections(elections.filter((e) => e._id !== election._id));
        setSuccessMessage("Election deleted successfully!");
      } catch (error) {
        console.error("Error deleting election:", error);
        setError(error.response?.data?.message || "Failed to delete election");
      }
    }
  };

  const dismissNotification = () => {
    setSuccessMessage(null);
    setError(null);
  };

  // Filter elections based on selected category
  const filteredElections =
    activeCategory === "all"
      ? elections
      : elections.filter((election) => election.category === activeCategory);

  return (
    <div className="min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section with animated gradient border */}
        <div className="relative overflow-hidden rounded-xl p-6 mb-8 bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-indigo-500/20 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5" />
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 blur opacity-30 animate-pulse" />

          <div className="relative z-10 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Elections Management
              </h2>
              <p className="mt-2 text-gray-300">
                Create and manage election events with advanced tracking and
                analytics
              </p>
            </div>
            <button
              onClick={() => setShowNewElectionModal(true)}
              className="mt-4 sm:mt-0 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg hover:from-indigo-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-purple-900/20"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              New Election
            </button>
          </div>
        </div>

        {/* Category selector */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-700/40 p-1.5 inline-flex">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              All Elections
            </button>
            <button
              onClick={() => setActiveCategory("upcoming")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeCategory === "upcoming"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveCategory("active")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeCategory === "active"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveCategory("past")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeCategory === "past"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/40 p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Elections</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {elections.length}
                </h3>
              </div>
              <div className="p-3 bg-indigo-900/30 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/40 p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Elections</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {elections.filter((e) => e.category === "active").length}
                </h3>
              </div>
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/40 p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-600/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Elections</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {elections.filter((e) => e.category === "upcoming").length}
                </h3>
              </div>
              <div className="p-3 bg-pink-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-pink-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-700/40 backdrop-blur-sm rounded-lg relative overflow-hidden shadow-lg">
            <div className="p-4 flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="flex-1 text-red-100">{error}</span>
              <button
                onClick={dismissNotification}
                className="text-red-400 hover:text-red-200"
              >
                <span className="text-xl">&times;</span>
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-700/40 backdrop-blur-sm rounded-lg relative overflow-hidden shadow-lg">
            <div className="p-4 flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="flex-1 text-green-100">{successMessage}</span>
              <button
                onClick={dismissNotification}
                className="text-green-400 hover:text-green-200"
              >
                <span className="text-xl">&times;</span>
              </button>
            </div>
          </div>
        )}

        {/* Pending Election Section */}
        {pendingElection && (
          <div className="mb-8">
            <PendingElection
              pendingElection={pendingElection}
              onAddCandidate={(position) => {
                setSelectedPosition(position);
                setShowCandidateModal(true);
              }}
              onFinalizeElection={handleFinalSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Elections List */}
        <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700/40 backdrop-blur-sm shadow-lg overflow-hidden relative">
          <ElectionList
            isLoading={isLoading}
            elections={elections}
            selectedPositionDetails={selectedPositionDetails}
            onPositionClick={handlePositionClick}
            onEditElection={handleEditElection}
            onDeleteElection={handleDeleteElection}
          />
        </div>
      </div>

      {/* Modals */}
      {showNewElectionModal && (
        <NewElectionModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => {
            setShowNewElectionModal(false);
            resetForm();
          }}
          onSubmit={handleCreateElection}
        />
      )}

      {showCandidateModal && (
        <AddCandidateModal
          students={students}
          candidateForm={candidateForm}
          setCandidateForm={setCandidateForm}
          selectedPosition={selectedPosition}
          onClose={() => {
            setShowCandidateModal(false);
            setCandidateForm({
              name: "",
              department: "",
              bio: "",
              photo_url: "",
              student: "",
            });
          }}
          onSubmit={handleAddCandidate}
        />
      )}
    </div>
  );
}

export default AdminElectionManage;
