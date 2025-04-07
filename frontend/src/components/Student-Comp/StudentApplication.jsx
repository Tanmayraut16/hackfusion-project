import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Filter,
  Plus,
  X,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

const API_URL = "http://localhost:3000/api/applications/all";
const API_URL2 = "http://localhost:3000/api/applications/add";

const statusColors = {
  pending: "bg-amber-500/20 text-amber-500 border border-amber-500/20",
  approved: "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20",
  rejected: "bg-rose-500/20 text-rose-500 border border-rose-500/20",
};

const priorityColors = {
  1: "text-rose-500",
  2: "text-orange-500",
  3: "text-yellow-500",
  4: "text-blue-500",
  5: "text-emerald-500",
};

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    priority: "3",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setdata] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setdata(data.data || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setdata([]);
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = data.filter((app) => {
    const matchesSearch =
      app.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      false ||
      app.description?.toLowerCase().includes(search.toLowerCase()) ||
      false;
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleViewDetails(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedApplication(response.data.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      alert("Error fetching application details.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        API_URL2,
        {
          category: formData.category,
          description: formData.description,
          priority: formData.priority,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Application submitted successfully!");
        setIsModalOpen(false);
        setFormData({ category: "", description: "", priority: "3" });

        const { data } = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setdata(data.data || []);
      } else {
        alert("Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <AlertTriangle className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
                Applications
              </h1>
              <p className="text-gray-400 mt-1">
                Manage and track your applications
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <Plus size={20} />
            New Application
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search applications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-700 text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr
                    key={application._id}
                    className="border-b border-gray-700 hover:bg-gray-750"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {application.user?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize">
                        {application.category || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          priorityColors[application.priority]
                        }`}
                      >
                        Level {application.priority || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          statusColors[application.status]
                        }`}
                      >
                        {application.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(application._id)}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors duration-200"
                      >
                        View Details
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {isDetailModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-[500px] max-w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">
                  Application Details
                </h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-400">Applicant</span>
                    <span className="font-medium">
                      {selectedApplication.user?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-400">Category</span>
                    <span className="capitalize">
                      {selectedApplication.category || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-400">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusColors[selectedApplication.status]
                      }`}
                    >
                      {selectedApplication.status || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">Submitted On</span>
                    <span>
                      {selectedApplication.createdAt
                        ? new Date(
                            selectedApplication.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-300">
                    {selectedApplication.description ||
                      "No description provided."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* New Application Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-[500px] max-w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">
                  New Application
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-gray-100 px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select a category</option>
                    <option value="event">Event</option>
                    <option value="budget">Budget</option>
                    <option value="sponsorship">Sponsorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-gray-100 px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none min-h-[120px]"
                    placeholder="Provide a detailed description..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-gray-100 px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option key={level} value={level}>
                        Level {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
