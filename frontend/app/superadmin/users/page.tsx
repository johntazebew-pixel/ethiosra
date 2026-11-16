// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/superadmin/users/page.tsx
// Description: Master User & Talent Management with 1-click Role Assignment,
//              Candidate Dossier Inspection Modal, filtering, and deletion.
// ============================================================================

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Shield,
  ArrowLeft,
  Mail,
  Trash2,
  AlertCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle,
  Award,
  Search,
  ExternalLink,
  Eye,
  X,
  Phone,
  Globe,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import SuperAdminNav from "@/components/layout/SuperAdminNav";

import { useRouter } from "next/navigation";

export default function SuperAdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Selected User Modal State (Candidate Dossier)
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token || token === "null" || token === "undefined") {
        setErrorMessage("Please sign in as SuperAdmin to view and manage accounts.");
        setUsers([]);
        router.push("/login?redirect=/superadmin/users");
        return;
      }

      const response = await api.get("/users");
      setUsers(response.data || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setErrorMessage("Your session has expired. Redirecting to login...");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        router.push("/login?redirect=/superadmin/users");
      } else {
        setErrorMessage(err.response?.data?.message || "Failed to fetch user accounts.");
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string, userEmail: string) => {
    setActionMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/users/${userId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActionMessage(`Role for ${userEmail} was updated to ${newRole}.`);
      fetchUsers();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to update user role. Please try again."
      );
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete user: ${email}?`)) {
      return;
    }

    setActionMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMessage(`User ${email} was successfully deleted.`);
      fetchUsers();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to remove user. Please try again."
      );
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        u.email?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q) ||
        u.city?.toLowerCase().includes(q) ||
        u.currentTitle?.toLowerCase().includes(q);

      const matchesRole = roleFilter === "ALL" ? true : u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    const superAdmins = users.filter((u) => u.role === "SUPERADMIN").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const seekers = users.filter((u) => u.role === "JOB_SEEKER").length;
    return { total: users.length, superAdmins, admins, seekers };
  }, [users]);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
      case "ADMIN":
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      <SuperAdminNav />

      {/* --- HEADER --- */}
      <div className="bg-gradient-to-br from-[#111111] via-[#333333] to-[#111111] pt-10 pb-20 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link
              href="/superadmin/dashboard"
              className="inline-flex items-center gap-1.5 text-neutral-200 hover:text-white font-medium mb-4 text-xs transition-colors"
            >
              <ArrowLeft size={14} /> Back to command center
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg shrink-0">
                <Users size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  User & Talent Access Management
                </h1>
                <p className="text-neutral-100/80 text-xs md:text-sm mt-0.5">
                  Manage registered accounts, adjust authorization roles, and inspect candidate career dossiers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-10">
        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Accounts</p>
            <p className="text-2xl font-black text-[#111111] mt-1">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">SuperAdmins</p>
            <p className="text-2xl font-black text-neutral-700 mt-1">{stats.superAdmins}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Admins / Recruiters</p>
            <p className="text-2xl font-black text-neutral-700 mt-1">{stats.admins}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Job Seekers</p>
            <p className="text-2xl font-black text-neutral-700 mt-1">{stats.seekers}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
          {actionMessage && (
            <div className="mb-6 bg-neutral-50 border border-neutral-200 text-neutral-700 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-2">
              <CheckCircle2 size={18} className="text-neutral-500 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            {/* Role Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "ALL", label: "All Roles" },
                { id: "SUPERADMIN", label: "SuperAdmins" },
                { id: "ADMIN", label: "Admins" },
                { id: "JOB_SEEKER", label: "Job Seekers" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setRoleFilter(pill.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    roleFilter === pill.id
                      ? "bg-[#111111] text-white shadow-sm"
                      : "bg-[#F7F7F7] text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, title, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#111111] font-medium"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 font-medium">
              <div className="w-10 h-10 border-4 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading user accounts and career profiles...
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-5 md:p-6 bg-[#F8FAFC] hover:bg-white rounded-2xl border border-slate-200/80 hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    {/* Top Row: Avatar, Name, Email, Role badge, Availability */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {(user.fullName || user.email).substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[#111111] text-base">
                            {user.fullName || user.email.split("@")[0]}
                          </h3>
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getRoleBadgeStyle(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                          {user.isAvailableForHire && (
                            <span className="text-[10px] font-bold text-neutral-700 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-full">
                              ● Ready for Hire
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {user.email}
                          {user.phone && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{user.phone}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Middle Row: Title, City, Education, Experience */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                      {user.currentTitle && (
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Briefcase size={13} className="text-[#111111]" />
                          {user.currentTitle}
                        </span>
                      )}
                      {user.city && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {user.city}
                        </span>
                      )}
                      {user.educationLevel && (
                        <span className="flex items-center gap-1">
                          <GraduationCap size={13} className="text-slate-400" />
                          {user.educationLevel}
                        </span>
                      )}
                      {user.yearsOfExperience !== undefined && user.yearsOfExperience !== null && (
                        <span className="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                          {user.yearsOfExperience} yrs exp
                        </span>
                      )}
                    </div>

                    {/* Skills pills */}
                    {Array.isArray(user.skills) && user.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {user.skills.slice(0, 5).map((skill: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-semibold bg-neutral-50 text-[#111111] px-2 py-0.5 rounded-md border border-neutral-100"
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 5 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{user.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* SuperAdmin Authority Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    {/* Role Selector */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1">
                      <Shield size={13} className="text-slate-400" />
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value, user.email)}
                        className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                        title="Change Account Role"
                      >
                        <option value="SUPERADMIN">SuperAdmin</option>
                        <option value="ADMIN">Admin</option>
                        <option value="JOB_SEEKER">Job Seeker</option>
                      </select>
                    </div>

                    {/* Inspect Dossier Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="p-2 bg-neutral-50 hover:bg-neutral-100 text-[#111111] rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                      title="Inspect Candidate Dossier"
                    >
                      <Eye size={15} />
                      <span className="hidden sm:inline">Dossier</span>
                    </button>

                    {user.resumeUrl && (
                      <a
                        href={user.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center gap-1"
                        title="Open CV Document"
                      >
                        <FileText size={15} />
                      </a>
                    )}

                    {/* Delete User */}
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-bold text-xs"
                      title="Delete User"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 font-medium bg-[#F7F7F7] rounded-2xl border border-slate-200">
              <AlertCircle size={36} className="mx-auto mb-2 text-slate-300" />
              <p>No user accounts matched your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- CANDIDATE DOSSIER INSPECTION MODAL --- */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors p-1"
            >
              <X size={20} />
            </button>

            {/* Dossier Header */}
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-600 to-neutral-700 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
                {(selectedUser.fullName || selectedUser.email).substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-[#111111]">
                    {selectedUser.fullName || selectedUser.email.split("@")[0]}
                  </h3>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getRoleBadgeStyle(
                      selectedUser.role
                    )}`}
                  >
                    {selectedUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{selectedUser.currentTitle || "Career Candidate"}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Dossier Body */}
            <div className="space-y-5 text-xs">
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-[#111111]" />
                  <span className="font-semibold text-slate-700">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-[#111111]" />
                  <span className="font-semibold text-slate-700">
                    {selectedUser.phone || "No phone provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#111111]" />
                  <span className="font-semibold text-slate-700">{selectedUser.city || "Addis Ababa"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-[#111111]" />
                  <span className="font-semibold text-slate-700">
                    Lang: {selectedUser.preferredLanguage || "EN"} • Theme: {selectedUser.preferredTheme || "LIGHT"}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {selectedUser.bio && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                    Professional Summary
                  </h4>
                  <p className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                    {selectedUser.bio}
                  </p>
                </div>
              )}

              {/* Career & Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                    Highest Education
                  </span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {selectedUser.educationLevel || "Not specified"}
                  </span>
                  {selectedUser.fieldOfStudy && (
                    <span className="text-slate-500 text-xs block mt-0.5">
                      Major: {selectedUser.fieldOfStudy}
                    </span>
                  )}
                </div>

                <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                    Experience
                  </span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {selectedUser.yearsOfExperience || 0} Years
                  </span>
                  <span className="text-neutral-700 font-semibold text-xs block mt-0.5">
                    {selectedUser.isAvailableForHire ? "Available for hire" : "Not actively seeking"}
                  </span>
                </div>
              </div>

              {/* Skills */}
              {Array.isArray(selectedUser.skills) && selectedUser.skills.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                    Skills & Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-neutral-50 text-[#111111] px-2.5 py-1 rounded-lg font-bold border border-neutral-100 flex items-center gap-1"
                      >
                        <Award size={12} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {selectedUser.resumeUrl && (
                  <a
                    href={selectedUser.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#111111] text-white rounded-xl font-bold hover:bg-[#111111] transition-colors"
                  >
                    <FileText size={14} /> View CV / Resume <ExternalLink size={12} />
                  </a>
                )}
                {selectedUser.linkedinUrl && (
                  <a
                    href={selectedUser.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    LinkedIn <ExternalLink size={12} />
                  </a>
                )}
                {selectedUser.portfolioUrl && (
                  <a
                    href={selectedUser.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Portfolio <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}