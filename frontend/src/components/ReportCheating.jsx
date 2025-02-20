import React, { useState, useEffect } from 'react';
import { Search, SortDesc, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import AddRecordForm from './Faculty-Comp/AddRecordForm';
import DeleteConfirmation from './Faculty-Comp/DeleteConfirmation';

const mockData = [
  {
    id: '1',
    registrationNumber: 'CS2021001',
    examName: 'Data Structures',
    reason: 'Found using unauthorized electronic device',
    reportedBy: 'FAC112',
    createdAt: '2024-03-15',
    details: 'Student was caught using a smartwatch to access course materials during the examination.'
  },
  {
    id: '2',
    registrationNumber: 'CS2021045',
    examName: 'Database Management',
    reason: 'Copying from another student',
    reportedBy: 'FAC156',
    createdAt: '2024-03-14',
    details: 'Student was observed copying answers from adjacent student. Both students were issued warnings.'
  },
  {
    id: '3',
    registrationNumber: 'CS2021089',
    examName: 'Computer Networks',
    reason: 'Unauthorized materials found',
    reportedBy: 'FAC134',
    createdAt: '2024-03-13',
    details: 'Handwritten notes were found under the answer sheet during routine inspection.'
  }
];

function ReportCheating() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedId, setExpandedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [records, setRecords] = useState(mockData);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const uniqueExams = Array.from(new Set(records.map(record => record.examName)));

  const filteredData = records
    .filter(record => 
      (record.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.examName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedExam === '' || record.examName === selectedExam)
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const handleAddRecord = (newRecord) => {
    const newId = (records.length + 1).toString();
    const currentDate = new Date().toISOString().split('T')[0];
    
    const recordToAdd = {
      id: newId,
      createdAt: currentDate,
      ...newRecord
    };

    setRecords([recordToAdd, ...records]);
    setShowAddForm(false);
  };

  const handleDeleteRecord = () => {
    if (recordToDelete) {
      setRecords(records.filter(record => record.id !== recordToDelete.id));
      setRecordToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {role === 'faculty' && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add New Record
            </button>
          </div>
        )}

        {showAddForm && role === 'faculty' && (
          <AddRecordForm onClose={() => setShowAddForm(false)} onSubmit={handleAddRecord} />
        )}

        {recordToDelete && role === 'faculty' && (
          <DeleteConfirmation registrationNumber={recordToDelete.registrationNumber} onClose={() => setRecordToDelete(null)} onConfirm={handleDeleteRecord} />
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by Registration Number or Exam Name"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              <option value="">All Exams</option>
              {uniqueExams.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
            
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <SortDesc className="h-5 w-5" />
              {sortOrder === 'asc' ? 'Oldest' : 'Latest'}
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  {role === 'faculty' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((record) => (
                  <React.Fragment key={record.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.registrationNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.examName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.reportedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</td>
                      {role === 'faculty' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button onClick={() => setRecordToDelete(record)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportCheating;
