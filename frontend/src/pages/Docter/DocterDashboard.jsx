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
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

// Removed mockData as data will now be fetched from the API

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("registrationNo", {
    header: "Registration No",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("studentDepartment", {
    header: "Department",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("studentYear", {
    header: "Year",
    cell: (info) => `Year ${info.getValue()}`,
  }),
  columnHelper.accessor("parentEmail", {
    header: "Parent Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("yourAppointment", {
    header: "Appointment Date",
    cell: (info) =>
      info.getValue() ? format(new Date(info.getValue()), "MMM d, yyyy") : "",
  }),
  columnHelper.accessor("allottedLeaves", {
    header: "Leaves",
    cell: (info) => (info.getValue() ? info.getValue().length : 0),
  }),
];

const DetailModal = ({ student, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Student Medical Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <User className="h-4 w-4" />
                <span className="text-sm">Registration Number</span>
              </div>
              <p className="text-gray-900 font-medium">
                {student.registrationNo}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Department</span>
              </div>
              <p className="text-gray-900 font-medium">
                {student.studentDepartment}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Parent Email</span>
              </div>
              <p className="text-gray-900 font-medium">{student.parentEmail}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Latest Appointment</span>
              </div>
              <p className="text-gray-900 font-medium">
                {student.yourAppointment
                  ? format(new Date(student.yourAppointment), "MMM d, yyyy")
                  : ""}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Leave History
            </h3>
            <div className="space-y-4">
              {student.allottedLeaves.map((leave, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <span className="text-sm text-gray-500">From</span>
                      <p className="font-medium text-gray-900">
                        {format(new Date(leave.fromDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">To</span>
                      <p className="font-medium text-gray-900">
                        {format(new Date(leave.toDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Reason</span>
                    <p className="font-medium text-gray-900">{leave.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State for fetched data
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/doctor/medicaldetails")
      .then((response) => {
        // Assuming API response format: { success: true, data: [...] }
        setData(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setFetchError(error.message || "Failed to fetch data");
        setIsLoading(false);
      });
  }, []);

  const table = useReactTable({
    data: data,
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Error: {fetchError}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar role="Docter" isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-r from-blue-50 via-blue-30 to-blue-20">
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userName="Docter"
        />
        <div className="max-w-7xl m-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">
                Student Medical Records
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A comprehensive list of all student medical records including
                registration details, department, and leave history.
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search records..."
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        {table.getFlatHeaders().map((header) => (
                          <th
                            key={header.id}
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            <div className="group inline-flex items-center gap-2">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <button
                                onClick={header.column.getToggleSortingHandler()}
                                className={`${
                                  header.column.getCanSort()
                                    ? "visible"
                                    : "invisible"
                                } ml-2`}
                              >
                                {{
                                  asc: <SortAsc className="h-4 w-4" />,
                                  desc: <SortDesc className="h-4 w-4" />,
                                }[header.column.getIsSorted() ?? "asc"] ?? (
                                  <SortAsc className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </th>
                        ))}
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedStudent(row.original)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(row.original);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                              <span className="sr-only">
                                , {row.original.registrationNo}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {selectedStudent && (
            <DetailModal
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
