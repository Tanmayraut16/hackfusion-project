import React, { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  MapPin,
  CalendarDays,
  User,
  ChevronRight,
  AlertTriangle,
  Layers,
  BookOpen,
  Loader2,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AddFacilityModal from "./AddFacilityModal";

/* ─────────────────────────────────────────────
   CONSTANTS & HELPERS
───────────────────────────────────────────── */
const API = import.meta.env.VITE_API_URL;
const POLL_INTERVAL = 30_000;

const fmtDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const statusStyles = {
  available: {
    pill: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 ring-1 ring-emerald-500/10",
    dot: "bg-emerald-400",
    label: "Available",
  },
  booked: {
    pill: "bg-blue-500/10 text-blue-400 border border-blue-500/25 ring-1 ring-blue-500/10",
    dot: "bg-blue-400",
    label: "Booked",
  },
  under_maintenance: {
    pill: "bg-amber-500/10 text-amber-400 border border-amber-500/25 ring-1 ring-amber-500/10",
    dot: "bg-amber-400",
    label: "Maintenance",
  },
};

const approvalStyles = {
  pending: {
    pill: "bg-violet-500/10 text-violet-400 border border-violet-500/25",
    label: "Pending",
  },
  approved: {
    pill: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
    label: "Approved",
  },
  rejected: {
    pill: "bg-rose-500/10 text-rose-400 border border-rose-500/25",
    label: "Rejected",
  },
};

/* ─────────────────────────────────────────────
   REUSABLE SUB-COMPONENTS
───────────────────────────────────────────── */

/** Skeleton card */
const SkeletonCard = () => (
  <div className="p-5 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-700/60 rounded w-2/5" />
        <div className="h-3 bg-gray-700/40 rounded w-1/3" />
      </div>
      <div className="h-6 w-20 bg-gray-700/40 rounded-full" />
    </div>
    <div className="mt-3 h-3 bg-gray-700/30 rounded w-3/4" />
  </div>
);

/** Empty state */
const EmptyState = ({ icon: Icon, title, sub }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-8">
    <div className="p-5 rounded-2xl bg-gray-800/70 border border-gray-700/40 shadow-inner">
      <Icon className="w-10 h-10 text-gray-500" strokeWidth={1.2} />
    </div>
    <p className="text-gray-300 font-semibold text-base">{title}</p>
    <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{sub}</p>
  </div>
);

/** Status pill */
const StatusPill = ({ status, map }) => {
  const s = map[status] ?? { pill: "bg-gray-800 text-gray-400 border border-gray-700", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${s.pill}`}>
      {s.dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />}
      {s.label}
    </span>
  );
};

/** Facility Card */
const FacilityCard = ({ facility }) => {
  const s = statusStyles[facility.status] ?? statusStyles.available;
  return (
    <div className="group p-5 hover:bg-white/[0.03] transition-all duration-300 border-b border-gray-700/40 last:border-b-0">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{facility.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <p className="text-xs text-gray-400 truncate">{facility.location}</p>
          </div>
        </div>
        <StatusPill status={facility.status} map={statusStyles} />
      </div>
      {facility.description && (
        <p className="mt-2.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
          {facility.description}
        </p>
      )}
    </div>
  );
};

/** Booking Request Card */
const BookingCard = ({ booking, onApprove, onReject, loading }) => {
  const facilityName = booking.facility?.name ?? "Unknown Facility";
  const userName =
    booking.user?.name ?? booking.user?.email ?? booking.user?._id ?? "Unknown User";

  return (
    <div className="group p-5 hover:bg-white/[0.03] transition-all duration-300 border-b border-gray-700/40 last:border-b-0">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{facilityName}</span>
            <StatusPill status={booking.approval_status} map={approvalStyles} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <User className="w-3 h-3 text-gray-500" />
            <span>{userName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CalendarDays className="w-3 h-3" />
            <span>{fmtDate(booking.start_time)}</span>
            <ChevronRight className="w-3 h-3" />
            <span>{fmtDate(booking.end_time)}</span>
          </div>
          {booking.reason && (
            <p className="text-xs text-gray-500 italic">"{booking.reason}"</p>
          )}
        </div>

        {booking.approval_status === "pending" && (
          <div className="flex gap-2 flex-shrink-0 self-center">
            <button
              onClick={() => onApprove(booking._id)}
              disabled={loading === booking._id}
              title="Approve"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/10"
            >
              {loading === booking._id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              Approve
            </button>
            <button
              onClick={() => onReject(booking._id)}
              disabled={loading === booking._id}
              title="Reject"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-rose-500/10"
            >
              {loading === booking._id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const AdminManageBookings = () => {
  /* ── State ── */
  const [activeTab, setActiveTab] = useState("facilities"); // "facilities" | "bookings"
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // booking _id being acted upon
  const [facilitySearch, setFacilitySearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("pending");
  const [lastRefreshed, setLastRefreshed] = useState(null);

  /* ── Modal ── */
  const [modalOpen, setModalOpen] = useState(false);

  /* ── Shared auth header helper — avoids "Bearer null" which causes 400s ── */
  const authHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found. Please log in again.");
    return { Authorization: `Bearer ${token}` };
  };

  /* ── Data fetchers ── */
  const fetchFacilities = useCallback(async (silent = false) => {
    if (!silent) setLoadingFacilities(true);
    try {
      // Route uses verifyStudentOrFaculty — auth header is required
      const { data } = await axios.get(`${API}/api/facilities`, {
        headers: authHeaders(),
      });
      setFacilities(data);
      setLastRefreshed(new Date());
    } catch (err) {
      if (!silent) {
        const msg =
          err?.response?.status === 404
            ? "Facilities endpoint not found — check your API mount path."
            : err?.response?.status === 400 || err?.response?.status === 401
            ? "Session expired. Please log in again."
            : "Could not load facilities.";
        toast.error(msg);
      }
    } finally {
      setLoadingFacilities(false);
    }
  }, []);

  const fetchBookings = useCallback(async (silent = false) => {
    if (!silent) setLoadingBookings(true);
    try {
      const { data } = await axios.get(`${API}/api/booking/bookings`, {
        headers: authHeaders(),
      });
      setBookings(data);
      setLastRefreshed(new Date());
    } catch (err) {
      if (!silent) {
        const msg =
          err?.response?.status === 400 || err?.response?.status === 401
            ? "Session expired. Please log in again."
            : err?.response?.status === 403
            ? "Your role doesn't have permission to view bookings."
            : "Could not load bookings.";
        toast.error(msg);
      }
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  /* ── Initial fetch + 30-second poll ── */
  useEffect(() => {
    fetchFacilities();
    fetchBookings();

    const interval = setInterval(() => {
      fetchFacilities(true);
      fetchBookings(true);
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchFacilities, fetchBookings]);

  /* ── Approve / Reject ── */
  const handleApprove = async (id) => {
    setActionLoading(id);
    const tid = toast.loading("Approving booking…");
    try {
      await axios.put(`${API}/api/booking/${id}/approve`, {}, {
        headers: authHeaders(),
      });
      toast.success("Booking approved!", { id: tid });
      fetchBookings(true);
      fetchFacilities(true);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Approval failed.", { id: tid });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    const tid = toast.loading("Rejecting booking…");
    try {
      await axios.put(`${API}/api/booking/bookings/${id}/reject`, {}, {
        headers: authHeaders(),
      });
      toast.success("Booking rejected.", { id: tid });
      fetchBookings(true);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Rejection failed.", { id: tid });
    } finally {
      setActionLoading(null);
    }
  };

  /* ── Filtered lists ── */
  const filteredFacilities = facilities.filter((f) => {
    const matchSearch =
      facilitySearch === "" ||
      f.name.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      f.location.toLowerCase().includes(facilitySearch.toLowerCase());
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredBookings = bookings.filter((b) => {
    const facilityName = b.facility?.name ?? "";
    const userName = b.user?.name ?? b.user?.email ?? "";
    const matchSearch =
      bookingSearch === "" ||
      facilityName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      userName.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchApproval = approvalFilter === "all" || b.approval_status === approvalFilter;
    return matchSearch && matchApproval;
  });

  /* ── Counts ── */
  const pendingCount = bookings.filter((b) => b.approval_status === "pending").length;

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <>
      {/* Toast Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#e5e7eb",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "10px",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#34d399", secondary: "#1f2937" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#1f2937" } },
        }}
      />

      {/* Add Facility Modal */}
      <AddFacilityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchFacilities()}
      />

      <div className="min-h-screen text-gray-100">
        {/* ── Background subtle grid ── */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(52,211,153,0.04) 0%, transparent 50%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Page Header ── */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-widest text-indigo-400 uppercase mb-1">
                Administration
              </p>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Facility &amp; Booking Control
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage campus facilities and approve booking requests.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastRefreshed && (
                <span className="text-xs text-gray-500 hidden sm:block">
                  Updated {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              )}
              <button
                onClick={() => { fetchFacilities(); fetchBookings(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 text-gray-400 hover:text-gray-200 text-xs font-medium transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  boxShadow: "0 2px 12px rgba(99,102,241,0.4)",
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Facility
              </button>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Facilities",
                value: facilities.length,
                icon: Building2,
                color: "text-indigo-400",
                bg: "bg-indigo-500/10",
              },
              {
                label: "Available",
                value: facilities.filter((f) => f.status === "available").length,
                icon: CheckCircle2,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                label: "Pending Requests",
                value: pendingCount,
                icon: Clock,
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
              {
                label: "Under Maintenance",
                value: facilities.filter((f) => f.status === "under_maintenance").length,
                icon: AlertTriangle,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/40 p-4 flex items-center gap-3"
              >
                <div className={`p-2 rounded-lg ${bg} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-white leading-none">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tab Bar ── */}
          <div className="flex items-center gap-1 bg-gray-800/50 backdrop-blur border border-gray-700/40 rounded-xl p-1 mb-6 w-fit">
            {[
              { id: "facilities", label: "Facility Management", icon: Layers },
              {
                id: "bookings",
                label: "Booking Requests",
                icon: BookOpen,
                badge: pendingCount > 0 ? pendingCount : null,
              },
            ].map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {badge && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-violet-500 text-white text-[10px] font-bold leading-none">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════
              TAB: FACILITY MANAGEMENT
          ══════════════════════════════════════ */}
          {activeTab === "facilities" && (
            <div className="space-y-4">
              {/* Search + Filter bar */}
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/40 p-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      value={facilitySearch}
                      onChange={(e) => setFacilitySearch(e.target.value)}
                      placeholder="Search by name or location…"
                      className="w-full bg-gray-900/60 border border-gray-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {["all", "available", "booked", "under_maintenance"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          statusFilter === s
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700/40"
                        }`}
                      >
                        {s === "all" ? "All" : s === "under_maintenance" ? "Maintenance" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Facilities grid */}
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-700/40 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Facilities
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      ({filteredFacilities.length})
                    </span>
                  </h2>
                  {/* Inline legend */}
                  <div className="hidden sm:flex items-center gap-4">
                    {Object.entries(statusStyles).map(([, val]) => (
                      <span key={val.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className={`w-1.5 h-1.5 rounded-full ${val.dot}`} />
                        {val.label}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Two-column grid for larger viewports */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-gray-700/40">
                  {loadingFacilities ? (
                    Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                  ) : filteredFacilities.length === 0 ? (
                    <div className="sm:col-span-2">
                      <EmptyState
                        icon={Building2}
                        title="No facilities found"
                        sub="Try adjusting your search or filter, or click Add Facility to create one."
                      />
                    </div>
                  ) : (
                    filteredFacilities.map((f) => <FacilityCard key={f._id} facility={f} />)
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB: BOOKING REQUESTS
          ══════════════════════════════════════ */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              {/* Search + Filter */}
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/40 p-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      placeholder="Search by facility or user…"
                      className="w-full bg-gray-900/60 border border-gray-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {["all", "pending", "approved", "rejected"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setApprovalFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          approvalFilter === s
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700/40"
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bookings Cards */}
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-700/40 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Booking Requests
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      ({filteredBookings.length})
                    </span>
                  </h2>
                  {pendingCount > 0 && (
                    <span className="text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-full font-medium">
                      {pendingCount} awaiting review
                    </span>
                  )}
                </div>

                <div>
                  {loadingBookings ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                  ) : filteredBookings.length === 0 ? (
                    <EmptyState
                      icon={CalendarDays}
                      title="No booking requests"
                      sub={
                        approvalFilter === "pending"
                          ? "You're all caught up! No pending bookings to review."
                          : "No bookings match your current filter."
                      }
                    />
                  ) : (
                    filteredBookings.map((b) => (
                      <BookingCard
                        key={b._id}
                        booking={b}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        loading={actionLoading}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminManageBookings;