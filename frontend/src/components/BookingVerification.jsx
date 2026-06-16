import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Clock,
  User,
  Loader2,
  ShieldCheck,
  ShieldX,
  Timer,
} from "lucide-react";
import { format, formatDuration, intervalToDuration } from "date-fns";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const calcDuration = (start, end) => {
  if (!start || !end) return null;
  try {
    const dur = intervalToDuration({
      start: new Date(start),
      end: new Date(end),
    });
    return (
      formatDuration(dur, {
        format: ["days", "hours", "minutes"],
        delimiter: " ",
      }) || "Less than a minute"
    );
  } catch {
    return null;
  }
};

/**
 * A booking is "valid" when:
 *   - approval_status === "approved"
 *   - current time is between start_time and end_time (i.e. the slot is active right now)
 */
const resolveValidity = (booking) => {
  if (!booking) return { valid: false, reason: "Booking not found." };

  if (booking.approval_status !== "approved") {
    return {
      valid: false,
      reason: `Booking is ${booking.approval_status ?? "not approved"}.`,
    };
  }

  const now = new Date();
  const start = booking.start_time ? new Date(booking.start_time) : null;
  const end = booking.end_time ? new Date(booking.end_time) : null;

  if (end && now > end) {
    return { valid: false, reason: "Booking period has already ended." };
  }

  if (start && now < start) {
    return {
      valid: false,
      reason: `Booking is not active yet. Starts at ${format(
        start,
        "dd MMM yyyy, hh:mm a"
      )}.`,
    };
  }

  return { valid: true, reason: null };
};

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ icon: Icon, iconClass, label, value }) => (
  <div className="flex items-start gap-4 py-3.5 border-b border-gray-800/60 last:border-0">
    <div className={`p-2 rounded-lg shrink-0 ${iconClass}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-gray-200 text-sm font-medium break-words">{value || "—"}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const BookingVerification = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!id) {
      setFetchError("No booking ID provided in URL.");
      setIsLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/booking/verify/${id}`
        );

        if (response.status === 404) {
          setFetchError("Booking not found. The QR code may be invalid.");
          return;
        }
        if (!response.ok) {
          throw new Error(`Server error (${response.status})`);
        }

        const data = await response.json();
        setBooking(data);
      } catch (err) {
        console.error("Verification error:", err);
        setFetchError(err.message || "Unable to verify booking.");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-5 bg-gray-800/60 rounded-full mb-4">
            <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
          </div>
          <p className="text-gray-400 text-lg">Verifying booking…</p>
        </div>
      </div>
    );
  }

  // ── Hard fetch error (404, network, etc.) ────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/60 border border-red-800/40 rounded-3xl p-10 text-center shadow-2xl">
          <div className="inline-block p-5 bg-red-500/10 rounded-full mb-5">
            <ShieldX className="h-12 w-12 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-300 mb-3">
            Verification Failed
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">{fetchError}</p>
        </div>
      </div>
    );
  }

  // ── Determine validity ───────────────────────────────────────────────────────
  const { valid, reason } = resolveValidity(booking);
  const duration = calcDuration(booking?.start_time, booking?.end_time);

  const studentName =
    booking?.student?.name ??
    booking?.student?.fullName ??
    booking?.studentName ??
    "Unknown Student";

  const facilityName =
    booking?.facility?.name ?? booking?.facilityName ?? "Unknown Facility";

  const facilityLocation = booking?.facility?.location ?? null;

  // ── Valid Pass ───────────────────────────────────────────────────────────────
  if (valid) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Green hero banner */}
          <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-emerald-600/30 to-teal-600/20 border border-emerald-500/30 border-b-0 px-8 pt-10 pb-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <div className="relative">
              <div className="inline-block p-4 bg-emerald-500/20 rounded-full mb-4 ring-4 ring-emerald-500/10">
                <ShieldCheck className="h-12 w-12 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-emerald-300 mb-1">
                Valid Pass
              </h1>
              <p className="text-emerald-400/70 text-sm">
                This entry pass is verified and active
              </p>
            </div>
          </div>

          {/* Details card */}
          <div className="bg-gray-900/80 border border-emerald-500/20 border-t-0 rounded-b-3xl px-8 py-6 shadow-2xl">
            <DetailRow
              icon={User}
              iconClass="bg-purple-500/10 text-purple-400"
              label="Student"
              value={studentName}
            />
            <DetailRow
              icon={MapPin}
              iconClass="bg-emerald-500/10 text-emerald-400"
              label="Facility"
              value={facilityName}
            />
            {facilityLocation && (
              <DetailRow
                icon={MapPin}
                iconClass="bg-blue-500/10 text-blue-400"
                label="Location"
                value={facilityLocation}
              />
            )}
            <DetailRow
              icon={Calendar}
              iconClass="bg-blue-500/10 text-blue-400"
              label="Start Time"
              value={
                booking.start_time
                  ? format(new Date(booking.start_time), "dd MMM yyyy, hh:mm a")
                  : null
              }
            />
            <DetailRow
              icon={Clock}
              iconClass="bg-indigo-500/10 text-indigo-400"
              label="End Time"
              value={
                booking.end_time
                  ? format(new Date(booking.end_time), "dd MMM yyyy, hh:mm a")
                  : null
              }
            />
            {duration && (
              <DetailRow
                icon={Timer}
                iconClass="bg-teal-500/10 text-teal-400"
                label="Duration"
                value={duration}
              />
            )}
            {booking.reason && (
              <DetailRow
                icon={CheckCircle}
                iconClass="bg-gray-700/40 text-gray-400"
                label="Purpose"
                value={booking.reason}
              />
            )}

            {/* Verified stamp */}
            <div className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">
                Entry Permitted
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Invalid / Expired Pass ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Red hero banner */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-red-600/30 to-rose-600/20 border border-red-500/30 border-b-0 px-8 pt-10 pb-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
          <div className="relative">
            <div className="inline-block p-4 bg-red-500/20 rounded-full mb-4 ring-4 ring-red-500/10">
              <ShieldX className="h-12 w-12 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-red-300 mb-1">
              Invalid Pass
            </h1>
            <p className="text-red-400/70 text-sm">
              This entry pass cannot be accepted
            </p>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-gray-900/80 border border-red-500/20 border-t-0 rounded-b-3xl px-8 py-6 shadow-2xl">
          {/* Reason chip */}
          <div className="mb-5 flex items-start gap-3 py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm leading-relaxed">{reason}</p>
          </div>

          {/* Still show whatever details we have */}
          <DetailRow
            icon={User}
            iconClass="bg-gray-700/40 text-gray-400"
            label="Student"
            value={studentName}
          />
          <DetailRow
            icon={MapPin}
            iconClass="bg-gray-700/40 text-gray-400"
            label="Facility"
            value={facilityName}
          />
          {booking?.start_time && (
            <DetailRow
              icon={Calendar}
              iconClass="bg-gray-700/40 text-gray-400"
              label="Booked From"
              value={format(
                new Date(booking.start_time),
                "dd MMM yyyy, hh:mm a"
              )}
            />
          )}
          {booking?.end_time && (
            <DetailRow
              icon={Clock}
              iconClass="bg-gray-700/40 text-gray-400"
              label="Booked Until"
              value={format(new Date(booking.end_time), "dd MMM yyyy, hh:mm a")}
            />
          )}

          {/* Denied stamp */}
          <div className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-300 text-sm font-medium">
              Entry Not Permitted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingVerification;