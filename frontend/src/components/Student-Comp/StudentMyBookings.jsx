import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  RefreshCw,
  QrCode,
  X,
  CheckCircle,
  XCircle,
  Hourglass,
  Timer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { format, formatDuration, intervalToDuration } from "date-fns";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true when a booking's end_time is in the past.
 * Uses the corrected `end_time` field (underscore) to match the MongoDB schema.
 */
const isBookingOver = (booking) => {
  if (!booking.end_time) return false;
  return new Date() > new Date(booking.end_time);
};

/**
 * Derives the effective display status, adding the client-side "completed" state.
 *   approved + end_time passed  → "completed"
 *   approved + still active     → "approved"
 *   anything else               → booking.approval_status (pending / rejected)
 */
const getEffectiveStatus = (booking) => {
  if (booking.approval_status === "approved" && isBookingOver(booking)) {
    return "completed";
  }
  return booking.approval_status ?? "pending";
};

const getStatusConfig = (effectiveStatus) => {
  switch (effectiveStatus) {
    case "approved":
      return {
        icon: CheckCircle,
        label: "Approved",
        badgeClass:
          "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
        dotClass: "bg-emerald-400",
      };
    case "completed":
      return {
        icon: CheckCircle,
        label: "Completed",
        badgeClass: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
        dotClass: "bg-gray-400",
      };
    case "rejected":
      return {
        icon: XCircle,
        label: "Rejected",
        badgeClass: "bg-red-500/20 text-red-300 border border-red-500/30",
        dotClass: "bg-red-400",
      };
    case "pending":
    default:
      return {
        icon: Hourglass,
        label: "Pending",
        badgeClass:
          "bg-amber-500/20 text-amber-300 border border-amber-500/30",
        dotClass: "bg-amber-400",
      };
  }
};

/**
 * Human-readable duration between two ISO date strings.
 * Returns null if either value is missing/invalid.
 */
const calcDuration = (start, end) => {
  if (!start || !end) return null;
  try {
    const duration = intervalToDuration({
      start: new Date(start),
      end: new Date(end),
    });
    return (
      formatDuration(duration, {
        format: ["days", "hours", "minutes"],
        delimiter: " ",
      }) || "Less than a minute"
    );
  } catch {
    return null;
  }
};

// ─── QR Modal ─────────────────────────────────────────────────────────────────
const QRModal = ({ booking, onClose }) => {
  /**
   * The QR now encodes a public verification URL.
   * Scanning this URL opens BookingVerification.jsx for a guard/admin check.
   * Format: <origin>/verify-booking/<bookingId>
   */
  const verifyUrl = `${window.location.origin}/verify-booking/${booking._id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0,0,0,0.75)",
      }}
    >
      <div className="relative bg-gray-900/90 border border-gray-700/60 rounded-3xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center gap-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Entry Pass</h2>
          <p className="text-gray-400 text-sm mt-1">
            {booking.facility?.name ?? booking.facility}
          </p>
        </div>

        {/* QR Code — encodes the public verification URL */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <QRCodeSVG
            value={verifyUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#111827"
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Booking time details — uses corrected start_time / end_time fields */}
        <div className="w-full space-y-2 text-sm">
          <div className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-2.5">
            <span className="text-gray-400 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              Start
            </span>
            <span className="text-gray-200 font-medium">
              {booking.start_time
                ? format(new Date(booking.start_time), "dd MMM yyyy, hh:mm a")
                : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-2.5">
            <span className="text-gray-400 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              End
            </span>
            <span className="text-gray-200 font-medium">
              {booking.end_time
                ? format(new Date(booking.end_time), "dd MMM yyyy, hh:mm a")
                : "—"}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Present this QR at the facility entrance. The guard will scan it to
          verify your pass on the verification screen.
        </p>
      </div>
    </div>
  );
};

// ─── Booking Card ─────────────────────────────────────────────────────────────
const BookingCard = ({ booking, onViewPass }) => {
  const effectiveStatus = getEffectiveStatus(booking);
  const statusConfig = getStatusConfig(effectiveStatus);
  const StatusIcon = statusConfig.icon;

  // Show "View Entry Pass" only for active (approved + not yet expired) bookings
  const canShowPass =
    booking.approval_status === "approved" && !isBookingOver(booking);

  const duration = calcDuration(booking.start_time, booking.end_time);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gray-900/40 backdrop-blur-sm hover:bg-gray-800/40 transition-all duration-500 border border-gray-800/50">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Status badge */}
      <div
        className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.badgeClass}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotClass}`}
        />
        <StatusIcon className="h-3.5 w-3.5" />
        <span>{statusConfig.label}</span>
      </div>

      <div className="relative p-6 pt-12">
        {/* Facility name */}
        <h3 className="text-xl font-bold text-gray-100 mb-4 group-hover:text-purple-400 transition-colors duration-300 pr-24">
          {booking.facility?.name ?? booking.facility ?? "Unknown Facility"}
        </h3>

        <div className="space-y-3 mb-6">
          {/* Location */}
          {booking.facility?.location && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-purple-500/10 p-2 rounded-lg shrink-0">
                <MapPin className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {booking.facility.location}
              </p>
            </div>
          )}

          {/* Time range — uses corrected start_time / end_time fields */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 bg-blue-500/10 p-2 rounded-lg shrink-0">
              <Calendar className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-sm text-gray-300 leading-relaxed">
              <p>
                <span className="text-gray-500">From: </span>
                {booking.start_time
                  ? format(
                      new Date(booking.start_time),
                      "dd MMM yyyy, hh:mm a"
                    )
                  : "—"}
              </p>
              <p className="mt-0.5">
                <span className="text-gray-500">To:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                {booking.end_time
                  ? format(new Date(booking.end_time), "dd MMM yyyy, hh:mm a")
                  : "—"}
              </p>
            </div>
          </div>

          {/* Duration — computed from start_time / end_time */}
          {duration && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-indigo-500/10 p-2 rounded-lg shrink-0">
                <Timer className="h-4 w-4 text-indigo-400" />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {duration}
              </p>
            </div>
          )}

          {/* Reason */}
          {booking.reason && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-emerald-500/10 p-2 rounded-lg shrink-0">
                <FileText className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {booking.reason}
              </p>
            </div>
          )}
        </div>

        {/* Entry pass button — only for active approved bookings */}
        {canShowPass && (
          <button
            onClick={() => onViewPass(booking)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg transition-all duration-300 active:scale-95"
          >
            <QrCode className="h-5 w-5" />
            View Entry Pass
          </button>
        )}

        {/* Completed footer note — shown instead of the button */}
        {effectiveStatus === "completed" && (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-800/40 border border-gray-700/40 text-gray-500 text-sm">
            <CheckCircle className="h-4 w-4" />
            Booking period has ended
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentMyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  const fetchBookings = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/booking/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings (${response.status})`);
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(false);
  }, [fetchBookings]);

  /**
   * The "completed" filter tab works on the client-side derived status,
   * not on the raw approval_status field from the DB.
   */
  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => getEffectiveStatus(b) === statusFilter);

  return (
    <div className="min-h-screen text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Header ── */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl" />
          <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-300" />
                </button>
                <div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
                    My Bookings
                  </h1>
                  <p className="text-gray-400 mt-2 text-lg">
                    Track your facility booking requests
                  </p>
                </div>
              </div>

              {/* Refresh button — animate-spin matches the main portal */}
              <button
                onClick={() => fetchBookings(true)}
                disabled={isRefreshing}
                className="flex items-center justify-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300 border border-gray-700/50"
              >
                <RefreshCw
                  className={`h-5 w-5 text-blue-400 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>

            {/* Filter tabs — "completed" is derived client-side */}
            <div className="flex flex-wrap gap-2 mt-8">
              {["all", "pending", "approved", "completed", "rejected"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 border ${
                      statusFilter === s
                        ? "bg-purple-600/30 text-purple-300 border-purple-500/50"
                        : "bg-gray-800/40 text-gray-400 border-gray-700/50 hover:bg-gray-700/40"
                    }`}
                  >
                    {s === "all" ? "All Bookings" : s}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-800/50 rounded-full">
              <RefreshCw className="h-12 w-12 text-purple-500 animate-spin" />
            </div>
            <p className="text-gray-300 text-lg mt-4">
              Loading your bookings…
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-red-800/30">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              Failed to load bookings
            </h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => fetchBookings(true)}
              className="px-6 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50">
            <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-400">
              {statusFilter === "all"
                ? "You haven't made any booking requests yet."
                : `No ${statusFilter} bookings to show.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onViewPass={setSelectedBooking}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── QR Modal ── */}
      {selectedBooking && (
        <QRModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default StudentMyBookings;