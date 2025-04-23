import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Search,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Calendar,
  Mail,
  FileText,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("registrationNo", {
    header: "Registration No",
    cell: (info) => (
      <div className="font-medium text-gray-100">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor("studentDepartment", {
    header: "Department",
    cell: (info) => (
      <div className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm inline-block border border-blue-800">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("studentYear", {
    header: "Year",
    cell: (info) => <div className="text-gray-300">Year {info.getValue()}</div>,
  }),
  columnHelper.accessor("parentEmail", {
    header: "Parent Email",
    cell: (info) => (
      <div className="flex items-center">
        <Mail className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-gray-300">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor("yourAppointment", {
    header: "Appointment Date",
    cell: (info) => (
      <div className="flex items-center">
        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-gray-300">
          {info.getValue()
            ? format(new Date(info.getValue()), "MMM d, yyyy")
            : "-"}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("allottedLeaves", {
    header: "Leaves",
    cell: (info) => (
      <div className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-sm inline-block border border-gray-700">
        {info.getValue() ? info.getValue().length : 0} leaves
      </div>
    ),
  }),
];

const DetailModal = ({ student, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100">
            Student Medical Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <User className="h-5 w-5" />
                <span className="font-medium">Registration Number</span>
              </div>
              <p className="text-gray-100 text-lg">{student.registrationNo}</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Department</span>
              </div>
              <p className="text-gray-100 text-lg">
                {student.studentDepartment}
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Mail className="h-5 w-5" />
                <span className="font-medium">Parent Email</span>
              </div>
              <p className="text-gray-100 text-lg">{student.parentEmail}</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Latest Appointment</span>
              </div>
              <p className="text-gray-100 text-lg">
                {student.yourAppointment
                  ? format(new Date(student.yourAppointment), "MMMM d, yyyy")
                  : "No appointment"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
              Leave History
            </h3>
            <div className="space-y-4">
              {student.allottedLeaves && student.allottedLeaves.length > 0 ? (
                student.allottedLeaves.map((leave, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/30 border border-gray-700 p-4 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="bg-blue-900/20 border border-blue-800/50 p-3 rounded-lg">
                        <span className="text-sm text-blue-400 font-medium">
                          From
                        </span>
                        <p className="text-gray-100 font-semibold mt-1">
                          {format(new Date(leave.fromDate), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-800/50 p-3 rounded-lg">
                        <span className="text-sm text-blue-400 font-medium">
                          To
                        </span>
                        <p className="text-gray-100 font-semibold mt-1">
                          {format(new Date(leave.toDate), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-lg">
                      <span className="text-sm text-gray-400 font-medium">
                        Reason
                      </span>
                      <p className="text-gray-100 mt-1">{leave.reason}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No leave history found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex h-screen items-center justify-center bg-gray-900">
    <div className="flex items-center gap-2 text-blue-400">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="font-medium">Loading records...</span>
    </div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="flex h-screen items-center justify-center bg-gray-900">
    <div className="flex items-center gap-2 text-red-400">
      <AlertCircle className="h-6 w-6" />
      <span className="font-medium">Error: {error}</span>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/doctor/medicaldetails`
        );
        setData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setFetchError(error.message || "Failed to fetch data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <LoadingState />;
  if (fetchError) return <ErrorState error={fetchError} />;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Student Medical Records
                </h1>
                <p className="mt-2 text-lg text-gray-400">
                  Manage and view comprehensive medical records of all students
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={globalFilter ?? ""}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                      placeholder="Search by name, department, or registration number..."
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800/50">
                    <tr>
                      {table.getFlatHeaders().map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                        >
                          <div className="group inline-flex items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <button
                                onClick={header.column.getToggleSortingHandler()}
                                className="p-1 hover:bg-gray-700 rounded"
                              >
                                {{
                                  asc: (
                                    <SortAsc className="h-4 w-4 text-blue-400" />
                                  ),
                                  desc: (
                                    <SortDesc className="h-4 w-4 text-blue-400" />
                                  ),
                                }[header.column.getIsSorted()] ?? (
                                  <SortAsc className="h-4 w-4 text-gray-500" />
                                )}
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th scope="col" className="relative px-6 py-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-800/30">
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedStudent(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(row.original);
                            }}
                            className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </span>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Showing {table.getState().pagination.pageSize} records per
                    page
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <DetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;