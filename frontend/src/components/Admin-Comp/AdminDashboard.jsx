import { useState } from "react";
import {
  Users, Vote, FileText, AlertCircle, Building2, DollarSign,
  Activity, CheckCircle2, Clock, TrendingUp, TrendingDown,
  Server, Cpu, Wifi, ShieldCheck, Plus, MessageSquareWarning,
  Wallet, BarChart3, UserCog, CalendarCheck, Bell, Settings,
  ChevronRight, Circle, Stethoscope, BookOpen, GraduationCap,
  Wrench, Layers, ArrowUpRight, Zap, Globe, Database,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const statsCards = [
  {
    id: 1,
    label: "Total Users",
    count: "12,847",
    trend: "+3.2% this month",
    trendUp: true,
    icon: Users,
    gradient: "from-violet-600/80 to-indigo-700/80",
    glow: "shadow-violet-500/30",
    iconBg: "bg-violet-500/30",
  },
  {
    id: 2,
    label: "Active Elections",
    count: "7",
    trend: "3 ending soon",
    trendUp: null,
    icon: Vote,
    gradient: "from-cyan-500/80 to-blue-600/80",
    glow: "shadow-cyan-500/30",
    iconBg: "bg-cyan-400/30",
  },
  {
    id: 3,
    label: "Pending Applications",
    count: "284",
    trend: "+18 today",
    trendUp: false,
    icon: FileText,
    gradient: "from-amber-500/80 to-orange-600/80",
    glow: "shadow-amber-500/30",
    iconBg: "bg-amber-400/30",
  },
  {
    id: 4,
    label: "Open Complaints",
    count: "53",
    trend: "-6 resolved today",
    trendUp: true,
    icon: AlertCircle,
    gradient: "from-rose-500/80 to-pink-600/80",
    glow: "shadow-rose-500/30",
    iconBg: "bg-rose-400/30",
  },
  {
    id: 5,
    label: "Facility Bookings",
    count: "139",
    trend: "22 pending review",
    trendUp: null,
    icon: Building2,
    gradient: "from-emerald-500/80 to-teal-600/80",
    glow: "shadow-emerald-500/30",
    iconBg: "bg-emerald-400/30",
  },
  {
    id: 6,
    label: "Budget Requests",
    count: "41",
    trend: "₹9.4L total requested",
    trendUp: false,
    icon: DollarSign,
    gradient: "from-fuchsia-500/80 to-purple-700/80",
    glow: "shadow-fuchsia-500/30",
    iconBg: "bg-fuchsia-400/30",
  },
];

const activities = [
  {
    id: 1,
    icon: Vote,
    title: "Student Council Election 2025 created",
    subtitle: "By Admin • Election Portal",
    time: "2 min ago",
    status: "new",
    statusLabel: "New",
    color: "text-cyan-400",
    statusColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  },
  {
    id: 2,
    icon: MessageSquareWarning,
    title: "Complaint: Lab equipment malfunction — CSE Dept.",
    subtitle: "Submitted by Rahul Sharma",
    time: "15 min ago",
    status: "pending",
    statusLabel: "Pending",
    color: "text-amber-400",
    statusColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  },
  {
    id: 3,
    icon: CalendarCheck,
    title: "Seminar Hall Booking approved",
    subtitle: "IT Dept. — June 12, 2025",
    time: "1 hr ago",
    status: "approved",
    statusLabel: "Approved",
    color: "text-emerald-400",
    statusColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },
  {
    id: 4,
    icon: Wallet,
    title: "Budget updated — Cultural Fest 2025",
    subtitle: "₹2,40,000 allocated",
    time: "3 hrs ago",
    status: "updated",
    statusLabel: "Updated",
    color: "text-violet-400",
    statusColor: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  },
  {
    id: 5,
    icon: Stethoscope,
    title: "Medical report submitted — Dr. Priya Nair",
    subtitle: "Health Centre Portal",
    time: "5 hrs ago",
    status: "submitted",
    statusLabel: "Submitted",
    color: "text-rose-400",
    statusColor: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  },
];

const analyticsMetrics = [
  { label: "Server Performance", value: 94, color: "from-cyan-400 to-blue-500", icon: Server },
  { label: "Response Rate", value: 87, color: "from-emerald-400 to-teal-500", icon: Wifi },
  { label: "Active Users %", value: 73, color: "from-violet-400 to-purple-500", icon: Users },
  { label: "Approval Success", value: 81, color: "from-amber-400 to-orange-500", icon: ShieldCheck },
];

const quickActions = [
  { label: "Create Election", icon: Vote, gradient: "from-cyan-500 to-blue-600", hover: "hover:shadow-cyan-500/40" },
  { label: "Review Complaints", icon: AlertCircle, gradient: "from-rose-500 to-pink-600", hover: "hover:shadow-rose-500/40" },
  { label: "Manage Budgets", icon: Wallet, gradient: "from-fuchsia-500 to-purple-600", hover: "hover:shadow-fuchsia-500/40" },
  { label: "View Reports", icon: BarChart3, gradient: "from-amber-500 to-orange-600", hover: "hover:shadow-amber-500/40" },
  { label: "Manage Users", icon: UserCog, gradient: "from-violet-500 to-indigo-600", hover: "hover:shadow-violet-500/40" },
  { label: "Facility Requests", icon: Building2, gradient: "from-emerald-500 to-teal-600", hover: "hover:shadow-emerald-500/40" },
];

const departments = [
  { name: "CSE", icon: Cpu, color: "from-cyan-500/20 to-blue-600/20", border: "border-cyan-500/30", accent: "text-cyan-400", students: 842, pending: 34, complaints: 12 },
  { name: "IT", icon: Globe, color: "from-violet-500/20 to-indigo-600/20", border: "border-violet-500/30", accent: "text-violet-400", students: 620, pending: 21, complaints: 7 },
  { name: "EXTC", icon: Zap, color: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/30", accent: "text-amber-400", students: 710, pending: 29, complaints: 15 },
  { name: "Mechanical", icon: Wrench, color: "from-rose-500/20 to-pink-600/20", border: "border-rose-500/30", accent: "text-rose-400", students: 530, pending: 18, complaints: 9 },
  { name: "Civil", icon: Layers, color: "from-emerald-500/20 to-teal-600/20", border: "border-emerald-500/30", accent: "text-emerald-400", students: 480, pending: 14, complaints: 5 },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

/** Stat Card */
const StatCard = ({ card }) => {
  const Icon = card.icon;
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5
        bg-gradient-to-br ${card.gradient}
        shadow-lg ${card.glow}
        border border-white/10
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]
        cursor-pointer group
      `}
    >
      {/* Decorative circle */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/10 transition-all duration-300" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">{card.label}</p>
          <p className="text-3xl font-black text-white mb-2 tracking-tight">{card.count}</p>
          <div className="flex items-center gap-1">
            {card.trendUp === true && <TrendingUp className="w-3 h-3 text-white/80" />}
            {card.trendUp === false && <TrendingDown className="w-3 h-3 text-white/80" />}
            {card.trendUp === null && <Circle className="w-2 h-2 text-white/60" />}
            <span className="text-xs text-white/70">{card.trend}</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${card.iconBg} backdrop-blur-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

/** Progress Bar Row */
const AnalyticRow = ({ metric }) => {
  const Icon = metric.icon;
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
          <span className="text-sm text-white/70 font-medium">{metric.label}</span>
        </div>
        <span className="text-sm font-bold text-white">{metric.value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-700`}
          style={{ width: `${metric.value}%` }}
        />
      </div>
    </div>
  );
};

/** Quick Action Button */
const ActionButton = ({ action }) => {
  const Icon = action.icon;
  return (
    <button
      className={`
        flex flex-col items-center justify-center gap-2 p-4 rounded-2xl
        bg-gradient-to-br ${action.gradient}
        shadow-lg ${action.hover}
        border border-white/10
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:scale-[1.03]
        group w-full
      `}
    >
      <div className="p-2.5 rounded-xl bg-white/20 group-hover:bg-white/30 transition-all duration-200">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs font-bold text-white/90 text-center leading-tight">{action.label}</span>
    </button>
  );
};

/** Department Card */
const DeptCard = ({ dept }) => {
  const Icon = dept.icon;
  return (
    <div
      className={`
        rounded-2xl p-4 border ${dept.border}
        bg-gradient-to-br ${dept.color}
        backdrop-blur-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg hover:border-white/30
        cursor-pointer
      `}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl bg-white/10`}>
          <Icon className={`w-5 h-5 ${dept.accent}`} />
        </div>
        <span className={`text-base font-black ${dept.accent}`}>{dept.name}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/50 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Students</span>
          <span className="text-xs font-bold text-white">{dept.students.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/50 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>
          <span className="text-xs font-bold text-amber-400">{dept.pending}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/50 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Complaints</span>
          <span className="text-xs font-bold text-rose-400">{dept.complaints}</span>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen text-white font-sans">

      {/* ── Background decorative glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-fuchsia-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── TOP HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-widest">System Online</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Admin
              </span>
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Here's what's happening across your campus today — Wednesday, 7 May 2025
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <Bell className="w-5 h-5 text-white/70" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <Settings className="w-5 h-5 text-white/70" />
            </button>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-black">
                SA
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">Super Admin</p>
                <p className="text-[10px] text-white/40 mt-0.5">admin@college.edu</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── STATS CARDS ── */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            {statsCards.map((card) => (
              <StatCard key={card.id} card={card} />
            ))}
          </div>
        </section>

        {/* ── MAIN GRID: Activities + Analytics ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Activities — 2 cols */}
          <div className="lg:col-span-2 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/20">
                  <Activity className="w-4 h-4 text-violet-400" />
                </div>
                <h2 className="font-black text-base tracking-tight">Recent Activities</h2>
              </div>
              <button className="text-xs text-white/40 hover:text-white/80 transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {activities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 transition-all duration-200 cursor-pointer group"
                  >
                    <div className={`p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all flex-shrink-0 ${act.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/90 truncate">{act.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{act.subtitle}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${act.statusColor}`}>
                        {act.statusLabel}
                      </span>
                      <span className="text-[10px] text-white/30">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Analytics — 1 col */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-cyan-500/20">
                <Database className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="font-black text-base tracking-tight">System Analytics</h2>
            </div>

            {/* Mini status chips */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                { label: "Uptime", value: "99.8%", ok: true },
                { label: "Load", value: "42%", ok: true },
                { label: "Errors", value: "2", ok: false },
                { label: "Alerts", value: "5", ok: false },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                  <p className={`text-base font-black ${s.ok ? "text-emerald-400" : "text-rose-400"}`}>{s.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Progress bars */}
            <div className="space-y-4">
              {analyticsMetrics.map((m) => (
                <AnalyticRow key={m.label} metric={m} />
              ))}
            </div>

            {/* Footer hint */}
            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-white/30">Last synced: 2 min ago</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-xs font-semibold">Healthy</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK ACTIONS + DEPARTMENTS ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-fuchsia-500/20">
                <Zap className="w-4 h-4 text-fuchsia-400" />
              </div>
              <h2 className="font-black text-base tracking-tight">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <ActionButton key={action.label} action={action} />
              ))}
            </div>
          </div>

          {/* Department Overview */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="font-black text-base tracking-tight">Department Overview</h2>
              </div>
              <button className="text-xs text-white/40 hover:text-white/80 transition-colors flex items-center gap-1">
                Details <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {departments.map((dept) => (
                <DeptCard key={dept.name} dept={dept} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="text-center text-xs text-white/20 pb-4">
          Campus Admin Portal &nbsp;·&nbsp; v2.5.1 &nbsp;·&nbsp; All systems operational
        </footer>
      </div>
    </div>
  );
}