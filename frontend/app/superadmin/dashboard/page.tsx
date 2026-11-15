// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/superadmin/dashboard/page.tsx
// Description: Master SuperAdmin Executive Command Center with full platform
//              KPIs, module routing, quick actions, and real-time oversight.
// ============================================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  CheckCircle,
  Users,
  Settings,
  Database,
  Briefcase,
  Building2,
  Layers,
  ArrowRight,
  LogOut,
  PlusCircle,
  Activity,
  AlertTriangle,
  ExternalLink,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import SuperAdminNav from "@/components/layout/SuperAdminNav";

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    pendingDeletionsCount: 0,
    usersCount: 0,
    superAdminsCount: 0,
    adminsCount: 0,
    seekersCount: 0,
    jobsCount: 0,
    publishedJobsCount: 0,
    draftJobsCount: 0,
    companiesCount: 0,
    categoriesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuperAdminData() {
      try {
        const token = localStorage.getItem("token");
        const [pendingRes, usersRes, jobsRes, companiesRes, categoriesRes] = await Promise.all([
          api.get("/approvals/pending", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
          api.get("/users", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
          api.get("/jobs/admin/all", { headers: { Authorization: `Bearer ${token}` } }).catch(() => api.get("/jobs")),
          api.get("/companies").catch(() => ({ data: [] })),
          api.get("/categories").catch(() => ({ data: [] })),
        ]);

        const usersList = usersRes.data || [];
        const jobsList = jobsRes.data || [];
        const pendingList = pendingRes.data || [];
        const compList = companiesRes.data || [];
        const catList = categoriesRes.data || [];

        setStats({
          pendingDeletionsCount: pendingList.length,
          usersCount: usersList.length,
          superAdminsCount: usersList.filter((u: any) => u.role === "SUPERADMIN").length,
          adminsCount: usersList.filter((u: any) => u.role === "ADMIN").length,
          seekersCount: usersList.filter((u: any) => u.role === "JOB_SEEKER").length,
          jobsCount: jobsList.length,
          publishedJobsCount: jobsList.filter((j: any) => j.status === "PUBLISHED" && !j.isDeleted).length,
          draftJobsCount: jobsList.filter((j: any) => j.status === "DRAFT").length,
          companiesCount: compList.length,
          categoriesCount: catList.length,
        });
      } catch (err) {
        console.error("Failed to fetch superadmin statistics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSuperAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F7FE] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#185DF1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium text-sm">
            Initializing SuperAdmin Command Center...
          </p>
        </div>
      </div>
    );
  }

  const modules = [
    {
      title: "User & Role Management",
      desc: "Promote/demote roles, inspect candidate career dossiers, and manage platform access.",
      href: "/superadmin/users",
      icon: Users,
      badge: `${stats.usersCount} Accounts`,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Master Job Vacancies",
      desc: "Override publication statuses, permanent force-purge, and monitor active opportunities.",
      href: "/superadmin/jobs",
      icon: Briefcase,
      badge: `${stats.jobsCount} Listings`,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Companies & Employers Directory",
      desc: "Register new hiring organizations, manage logos, and review verified employer badges.",
      href: "/superadmin/companies",
      icon: Building2,
      badge: `${stats.companiesCount} Partners`,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      title: "Categories & Taxonomies",
      desc: "Create and organize standardized sectors, functional specializations, and job filters.",
      href: "/superadmin/categories",
      icon: Layers,
      badge: `${stats.categoriesCount} Categories`,
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    {
      title: "Job Deletion Approvals",
      desc: "Review and authorize or reject pending vacancy removal requests submitted by administrators.",
      href: "/superadmin/approvals",
      icon: ShieldAlert,
      badge: `${stats.pendingDeletionsCount} Pending`,
      color: stats.pendingDeletionsCount > 0
        ? "text-amber-700 bg-amber-50 border-amber-300 animate-pulse"
        : "text-slate-600 bg-slate-50 border-slate-200",
    },
    {
      title: "Global Platform Settings",
      desc: "Configure platform branding logo, default localization, and Telegram channel broadcast.",
      href: "/superadmin/settings",
      icon: Settings,
      badge: "Config",
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Database Health & Backups",
      desc: "Monitor Neon PostgreSQL latency, live table statistics, and download snapshot archives.",
      href: "/superadmin/database",
      icon: Database,
      badge: "Live AWS",
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F7FE] pb-24">
      <SuperAdminNav />

      {/* --- HERO BANNER --- */}
      <div className="bg-gradient-to-br from-[#031130] via-[#081d4a] to-[#185DF1] pt-10 pb-20 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-xl shrink-0">
              <ShieldAlert size={34} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  SuperAdmin Command Center
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/30 border border-purple-300/40 text-purple-200">
                  Full Authority
                </span>
              </div>
              <p className="text-blue-100/80 text-xs md:text-sm">
                Master enterprise administration, database governance, and platform-wide moderation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-colors text-xs font-bold inline-flex items-center gap-2"
              title="Sign Out of SuperAdmin"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- STATS KPI GRID --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
          {/* Total Users */}
          <Link
            href="/superadmin/users"
            className="bg-white p-4 rounded-2xl shadow-md border border-slate-200/80 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-[#185DF1] transition-colors mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
              <Users size={16} />
            </div>
            <p className="text-2xl font-black text-[#031130]">{stats.usersCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {stats.adminsCount} Admins • {stats.seekersCount} Seekers
            </p>
          </Link>

          {/* Active Jobs */}
          <Link
            href="/superadmin/jobs"
            className="bg-white p-4 rounded-2xl shadow-md border border-slate-200/80 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600 transition-colors mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Master Jobs</span>
              <Briefcase size={16} />
            </div>
            <p className="text-2xl font-black text-emerald-700">{stats.jobsCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {stats.publishedJobsCount} Published • {stats.draftJobsCount} Draft
            </p>
          </Link>

          {/* Companies */}
          <Link
            href="/superadmin/companies"
            className="bg-white p-4 rounded-2xl shadow-md border border-slate-200/80 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 transition-colors mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Companies</span>
              <Building2 size={16} />
            </div>
            <p className="text-2xl font-black text-[#031130]">{stats.companiesCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Verified employers</p>
          </Link>

          {/* Categories */}
          <Link
            href="/superadmin/categories"
            className="bg-white p-4 rounded-2xl shadow-md border border-slate-200/80 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-teal-600 transition-colors mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Categories</span>
              <Layers size={16} />
            </div>
            <p className="text-2xl font-black text-[#031130]">{stats.categoriesCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Industry taxonomies</p>
          </Link>

          {/* Approvals */}
          <Link
            href="/superadmin/approvals"
            className={`p-4 rounded-2xl shadow-md border transition-all group ${
              stats.pendingDeletionsCount > 0
                ? "bg-amber-50/70 border-amber-300 hover:border-amber-400"
                : "bg-white border-slate-200/80 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-600 transition-colors mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Approvals</span>
              <ShieldAlert size={16} className={stats.pendingDeletionsCount > 0 ? "text-amber-600" : ""} />
            </div>
            <p className={`text-2xl font-black ${stats.pendingDeletionsCount > 0 ? "text-amber-800" : "text-[#031130]"}`}>
              {stats.pendingDeletionsCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {stats.pendingDeletionsCount > 0 ? "Action required!" : "Queue clear"}
            </p>
          </Link>

          {/* Database */}
          <Link
            href="/superadmin/database"
            className="bg-white p-4 rounded-2xl shadow-md border border-slate-200/80 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-rose-600 transition-colors mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">DB Status</span>
              <Activity size={16} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-600">Online</p>
            <p className="text-[11px] text-slate-400 mt-0.5">PostgreSQL Neon</p>
          </Link>
        </div>

        {/* QUICK ACTIONS BAR */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-8 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pl-2">
            <Sparkles size={14} className="text-amber-500" />
            <span>SuperAdmin Quick Actions:</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/jobs/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#185DF1] hover:bg-[#031130] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <PlusCircle size={14} /> Post Job Vacancy
            </Link>

            <Link
              href="/superadmin/companies"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F3F7FE] hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200"
            >
              <Building2 size={14} /> Register Company
            </Link>

            <Link
              href="/superadmin/categories"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F3F7FE] hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200"
            >
              <Layers size={14} /> Add Category
            </Link>

            {stats.pendingDeletionsCount > 0 && (
              <Link
                href="/superadmin/approvals"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-black transition-colors shadow-sm animate-pulse"
              >
                <AlertTriangle size={14} /> Review {stats.pendingDeletionsCount} Requests
              </Link>
            )}
          </div>
        </div>

        {/* --- MANAGEMENT MODULES GRID --- */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#031130]">Full Permission Control Modules</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct access to manage all operational aspects of the EthioSra platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="p-6 bg-[#F8FAFC] hover:bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${mod.color}`}>
                        <Icon size={22} />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600">
                        {mod.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#031130] text-base group-hover:text-[#185DF1] transition-colors mb-1.5">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#185DF1]">
                    <span>Manage Module</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}