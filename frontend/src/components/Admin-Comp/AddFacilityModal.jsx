import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Building2,
  MapPin,
  FileText,
  CheckCircle2,
  CalendarClock,
  Wrench,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────
   STATUS OPTIONS — visual card picker
───────────────────────────────────────────── */
const STATUS_OPTIONS = [
  {
    value: "available",
    label: "Available",
    description: "Ready to be booked",
    icon: CheckCircle2,
    colors: {
      ring: "ring-emerald-500/60",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      icon: "text-emerald-400",
      dot: "bg-emerald-400",
      label: "text-emerald-400",
    },
  },
  {
    value: "booked",
    label: "Booked",
    description: "Currently reserved",
    icon: CalendarClock,
    colors: {
      ring: "ring-blue-500/60",
      bg: "bg-blue-500/10",
      border: "border-blue-500/40",
      icon: "text-blue-400",
      dot: "bg-blue-400",
      label: "text-blue-400",
    },
  },
  {
    value: "under_maintenance",
    label: "Maintenance",
    description: "Temporarily offline",
    icon: Wrench,
    colors: {
      ring: "ring-amber-500/60",
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
      icon: "text-amber-400",
      dot: "bg-amber-400",
      label: "text-amber-400",
    },
  },
];

/* ─────────────────────────────────────────────
   FIELD COMPONENT — styled input with icon
───────────────────────────────────────────── */
const Field = ({ id, label, icon: Icon, required, children }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={id}
      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest"
    >
      <Icon className="w-3 h-3 text-gray-500" />
      {label}
      {required && <span className="text-indigo-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   MAIN MODAL COMPONENT
───────────────────────────────────────────── */
const AddFacilityModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedStatus, setSelectedStatus] = useState("available");
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const formRef = useRef(null);
  const firstInputRef = useRef(null);

  /* ── Animate in/out ── */
  useEffect(() => {
    if (isOpen) {
      // tiny delay so CSS transition fires
      requestAnimationFrame(() => setVisible(true));
      setTimeout(() => firstInputRef.current?.focus(), 120);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  /* ── ESC to close ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  /* ── Prevent body scroll ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      setSelectedStatus("available");
      formRef.current?.reset();
    }, 250); // match transition duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name")?.trim(),
      location: fd.get("location")?.trim(),
      description: fd.get("description")?.trim(),
      status: selectedStatus,
    };

    if (!payload.name || !payload.location) {
      toast.error("Name and location are required.");
      return;
    }

    setSubmitting(true);
    const tid = toast.loading("Creating facility…");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/facilities`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Facility created successfully!", { id: tid });
      handleClose();
      onSuccess?.();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ?? "Failed to create facility.",
        { id: tid }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen && !visible) return null;

  return (
    /* ── Backdrop ── */
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: `rgba(3,7,18,${visible ? 0.75 : 0})`,
        backdropFilter: `blur(${visible ? 12 : 0}px)`,
        transition: "background-color 250ms ease, backdrop-filter 250ms ease",
      }}
    >
      {/* ── Modal Panel ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg"
        style={{
          transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(16px)",
          opacity: visible ? 1 : 0,
          transition: "transform 250ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease",
        }}
      >
        {/* Glow halo behind card */}
        <div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, transparent 50%, rgba(52,211,153,0.1) 100%)",
            filter: "blur(1px)",
          }}
        />

        <div className="relative bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl overflow-hidden">

          {/* ── Decorative top strip ── */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, #6366f1 0%, #818cf8 40%, #34d399 100%)",
            }}
          />

          {/* ── Header ── */}
          <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)",
                  border: "1px solid rgba(99,102,241,0.25)",
                }}
              >
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  New Facility
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Add a campus space to the booking system
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Form ── */}
          <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

            {/* Name */}
            <Field id="name" label="Facility Name" icon={Building2} required>
              <input
                ref={firstInputRef}
                type="text"
                name="name"
                id="name"
                required
                placeholder="e.g. Seminar Hall A"
                className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40 transition-all duration-200 hover:border-gray-600/80"
              />
            </Field>

            {/* Location */}
            <Field id="location" label="Location" icon={MapPin} required>
              <input
                type="text"
                name="location"
                id="location"
                required
                placeholder="e.g. Block B, 2nd Floor"
                className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40 transition-all duration-200 hover:border-gray-600/80"
              />
            </Field>

            {/* Description */}
            <Field id="description" label="Description" icon={FileText}>
              <textarea
                name="description"
                id="description"
                rows={3}
                placeholder="Capacity, equipment, special notes…"
                className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40 transition-all duration-200 hover:border-gray-600/80 resize-none"
              />
            </Field>

            {/* Status — card picker */}
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-gray-500" />
                Initial Status
                <span className="text-indigo-400">*</span>
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {STATUS_OPTIONS.map(({ value, label, description, icon: Icon, colors }) => {
                  const active = selectedStatus === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedStatus(value)}
                      className={`
                        relative flex flex-col items-center gap-2 p-3 rounded-xl border
                        text-center transition-all duration-200 focus:outline-none
                        ${active
                          ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} shadow-lg`
                          : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600/60"
                        }
                      `}
                    >
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          active ? colors.bg : "bg-gray-700/50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            active ? colors.icon : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold transition-colors ${
                            active ? colors.label : "text-gray-400"
                          }`}
                        >
                          {label}
                        </p>
                        <p className="text-[10px] text-gray-600 leading-tight mt-0.5">
                          {description}
                        </p>
                      </div>
                      {active && (
                        <span
                          className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${colors.dot} shadow-sm`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Footer actions ── */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-700/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800/80 hover:border-gray-600 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: submitting
                    ? "#4f46e5"
                    : "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)",
                  boxShadow: submitting
                    ? "none"
                    : "0 4px 20px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Facility
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFacilityModal;