import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, SortDesc, Plus, Trash2, AlertCircle, Calendar, User, BookOpen, Shield } from "lucide-react";
import AddRecordForm from "./Faculty-Comp/AddRecordForm";
import DeleteConfirmation from "./Faculty-Comp/DeleteConfirmation";

const ReportCheating = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [records, setRecords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cheating/all`);
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
      setRecords([]);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;

    try {
      const tok = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cheating/delete/${recordToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${tok}` },
        }
      );

      await fetchRecords();
      setRecordToDelete(null);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const uniqueExams = Array.from(
    new Set(records.map((record) => record.examName).filter(Boolean))
  );

  const filteredData = records
    .filter((record) => {
      const studentName = record?.student?.name?.toLowerCase() || "";
      const examName = record?.examName?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      return (
        (studentName.includes(searchTermLower) ||
          examName.includes(searchTermLower)) &&
        (selectedExam === "" || record?.examName === selectedExam)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0).getTime();
      const dateB = new Date(b?.createdAt || 0).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Academic Integrity Reports
          </h1>
          <p className="text-gray-400">Monitor and manage reported academic integrity violations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Total Reports</h2>
            </div>
            <p className="text-3xl font-bold text-white">{records.length}</p>
            <p className="mt-2 text-sm text-gray-400">Total reported incidents</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Unique Exams</h2>
            </div>
            <p className="text-3xl font-bold text-white">{uniqueExams.length}</p>
            <p className="mt-2 text-sm text-gray-400">Different exams affected</p>
          </div>

        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by student or exam name..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                           text-white placeholder-gray-400 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                         text-white transition-all"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option value="">All Exams</option>
                {uniqueExams.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg 
                         hover:bg-gray-700 flex items-center gap-2 text-white transition-all"
              >
                <SortDesc className="h-5 w-5" />
                {sortOrder === "asc" ? "Oldest" : "Latest"}
              </button>

              {role === "faculty" && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg 
                           hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  New Report
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredData.map((record) => (
              <div
                key={record._id}
                className="bg-gray-800/30 rounded-lg p-6 hover:bg-gray-700/30 transition-all 
                         border border-gray-700 hover:border-gray-600"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gray-700 rounded-lg">
                        <User className="h-4 w-4 text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-white">
                        {record?.student?.name || "N/A"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="p-1.5 bg-gray-700 rounded-lg">
                        <BookOpen className="h-4 w-4 text-purple-400" />
                      </div>
                      <span>{record?.examName || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-300 bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      {record?.reason || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400">Reported By</span>
                      <span className="font-medium text-white">
                        {record?.reportedBy?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400">Date</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-white">
                          {record?.createdAt
                            ? new Date(record.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {role === "faculty" && (
                      <button
                        onClick={() => setRecordToDelete(record)}
                        className="p-2 text-red-400 hover:bg-gray-600 rounded-lg transition-all
                                 hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No reports found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddForm && role === "faculty" && (
        <AddRecordForm
          onClose={() => setShowAddForm(false)}
          onSubmit={fetchRecords}
        />
      )}

      {recordToDelete && role === "faculty" && (
        <DeleteConfirmation
          registrationNumber={recordToDelete?.student?.registrationNumber}
          onClose={() => setRecordToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ReportCheating;