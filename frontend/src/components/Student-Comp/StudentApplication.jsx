import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";



const API_URL = "http://localhost:3000/api/applications/all";
const API_URL2 = "http://localhost:3000/api/applications/add";





const statusColors = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
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
      const token = localStorage.getItem("token"); // Assuming you store JWT in localStorage
      const { data } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setdata(data.data);
    };
    fetchApplications();  
  }, []);


  console.log(data);
  


  
  

  const filteredApplications = data.filter((app) => {
    const matchesSearch =
      app.user.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleViewDetails(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = localStorage.getItem("token"); // Retrieve token for authentication
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
  
        // Refresh the application list
        const { data } = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setdata(data.data);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          New Application
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 w-44"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="border rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Applicant</th>
              <th className="p-3">Category</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Submitted</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application._id} className="border-t">
                <td className="p-3 font-medium">{application.user.name}</td>
                <td className="p-3 capitalize">{application.category}</td>
                <td className="p-3">{application.priority}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-lg text-white ${statusColors[application.status]}`}>
                    {application.status}
                  </span>
                </td>
                <td className="p-3">{new Date(application.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                <button
                    onClick={() => handleViewDetails(application._id)}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isDetailModalOpen && selectedApplication && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300">
    <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] transform scale-95 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
        <button
          onClick={() => setIsDetailModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      </div>

      <div className="space-y-3 text-gray-700">
        <p><strong>Applicant:</strong> {selectedApplication.user.name}</p>
        <p><strong>Category:</strong> {selectedApplication.category}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-3 py-1 rounded-full text-white ${
              selectedApplication.status === "pending"
                ? "bg-yellow-500"
                : selectedApplication.status === "approved"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {selectedApplication.status}
          </span>
        </p>
        <p><strong>Description:</strong> {selectedApplication.description}</p>
        <p><strong>Submitted On:</strong> {new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
      </div>

      <button
        onClick={() => setIsDetailModalOpen(false)}
        className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Close
      </button>
    </div>
  </div>
)}

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">New Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a category</option>
                  <option value="event">Event</option>
                  <option value="budget">Budget</option>
                  <option value="sponsorship">Sponsorship</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Provide a detailed description..."
                />
              </div>
              <div>
                <label className="block font-medium">Priority Level</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level}>
                      Level {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
