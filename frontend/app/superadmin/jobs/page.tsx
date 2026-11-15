// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/superadmin/jobs/page.tsx
// Description: Master Jobs Control Center for SuperAdmin with status overrides,
//              force deletion, centered Edit popup modal with blurred background,
//              multi-filter search, and direct job publishing.
// ============================================================================

"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Briefcase,
  Building2,
  Trash2,
  ArrowLeft,
  PlusCircle,
  AlertCircle,
  MapPin,
  DollarSign,
  Layers,
  Eye,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  Check,
  X,
  ExternalLink,
  Edit2,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import SuperAdminNav from "@/components/layout/SuperAdminNav";

export default function SuperAdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [mounted, setMounted] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    location: "Addis Ababa",
    workplaceType: "ON_SITE",
    status: "PUBLISHED",
    salaryMin: "" as number | "",
    salaryMax: "" as number | "",
    salaryCurrency: "ETB",
    isSalaryNegotiable: true,
    applicationMethod: "WEBSITE",
    applicationUrl: "",
    deadlineDate: "",
    description: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (editModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [editModalOpen]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api
        .get("/jobs/admin/all")
        .catch(() => api.get("/jobs"));

      setJobs(response.data || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setErrorMessage("Your session has expired. Redirecting to login...");
        router.push("/login?redirect=/superadmin/jobs");
      } else {
        setErrorMessage("Failed to fetch jobs.");
      }
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openEditModal = (job: any) => {
    setEditForm({
      id: job.id,
      title: job.title || "",
      location: job.location || "Addis Ababa",
      workplaceType: job.workplaceType || "ON_SITE",
      status: job.status || "PUBLISHED",
      salaryMin: job.salaryMin || "",
      salaryMax: job.salaryMax || "",
      salaryCurrency: job.salaryCurrency || "ETB",
      isSalaryNegotiable: !!job.isSalaryNegotiable,
      applicationMethod: job.applicationMethod || "WEBSITE",
      applicationUrl: job.applicationUrl || "",
      deadlineDate: job.deadlineDate ? job.deadlineDate.split("T")[0] : "",
      description: job.description || "",
    });
    setEditModalOpen(true);
  };

  const handleSaveJobEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      setErrorMessage("Job title is required.");
      return;
    }

    setSavingEdit(true);
    setActionMessage("");
    setErrorMessage("");

    try {
      const payload: any = {
        title: editForm.title.trim(),
        location: editForm.location.trim(),
        workplaceType: editForm.workplaceType,
        status: editForm.status,
        isSalaryNegotiable: editForm.isSalaryNegotiable,
        salaryCurrency: editForm.salaryCurrency,
        applicationMethod: editForm.applicationMethod,
        applicationUrl: editForm.applicationUrl.trim() || undefined,
        description: editForm.description.trim() || undefined,
      };

      if (editForm.salaryMin !== "") payload.salaryMin = Number(editForm.salaryMin);
      if (editForm.salaryMax !== "") payload.salaryMax = Number(editForm.salaryMax);
      if (editForm.deadlineDate) payload.deadlineDate = new Date(editForm.deadlineDate).toISOString();

      await api.patch(`/jobs/${editForm.id}`, payload);
      setActionMessage(`Job "${editForm.title}" was successfully updated.`);
      setEditModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to update job vacancy. Please check inputs."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    setActionMessage("");
    setErrorMessage("");

    try {
      await api.patch(`/jobs/${jobId}`, {
        status: newStatus,
        isDeleted: newStatus === "ARCHIVED",
      });
      setActionMessage(`Job status updated to ${newStatus}.`);
      fetchJobs();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to update job status. Please try again."
      );
    }
  };

  const handleForceDelete = async (jobId: string, jobTitle: string) => {
    if (
      !confirm(
        `SUPERADMIN ACTION: Are you sure you want to PERMANENTLY delete "${jobTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setActionMessage("");
    setErrorMessage("");

    try {
      await api
        .delete(`/jobs/${jobId}/force`)
        .catch(() => api.delete(`/jobs/${jobId}`));

      setActionMessage(`Job "${jobTitle}" was permanently deleted from the database.`);
      fetchJobs();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to delete job. Please try again."
      );
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        job.title?.toLowerCase().includes(q) ||
        job.company?.name?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "DELETED"
          ? job.isDeleted || job.status === "PENDING_DELETION"
          : job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const published = jobs.filter((j) => j.status === "PUBLISHED" && !j.isDeleted).length;
    const drafts = jobs.filter((j) => j.status === "DRAFT").length;
    const pending = jobs.filter((j) => j.isDeleted || j.status === "PENDING_DELETION").length;
    return { total: jobs.length, published, drafts, pending };
  }, [jobs]);

  // Edit Modal Content with blurred background
  const editModalContent = editModalOpen && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Dark Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => setEditModalOpen(false)}
      />

      {/* Centered Modal Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => setEditModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#185DF1] flex items-center justify-center font-bold">
            <Edit2 size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#031130]">Edit Job Vacancy</h3>
            <p className="text-xs text-slate-500">
              Update posting details, compensation, deadline, and live publication status.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveJobEdit} className="space-y-4 mt-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City / Location
              </label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Workplace Arrangement
              </label>
              <select
                value={editForm.workplaceType}
                onChange={(e) => setEditForm({ ...editForm, workplaceType: e.target.value })}
                className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] cursor-pointer"
              >
                <option value="ON_SITE">On-site (Office)</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] cursor-pointer"
              >
                <option value="PUBLISHED">Published Live</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Application Method
              </label>
              <select
                value={editForm.applicationMethod}
                onChange={(e) => setEditForm({ ...editForm, applicationMethod: e.target.value })}
                className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1] cursor-pointer"
              >
                <option value="WEBSITE">Website Portal</option>
                <option value="EMAIL">Email Submission</option>
                <option value="TELEGRAM">Telegram Bot</option>
                <option value="GOOGLE_FORM">Google Form</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Deadline Date
              </label>
              <input
                type="date"
                value={editForm.deadlineDate}
                onChange={(e) => setEditForm({ ...editForm, deadlineDate: e.target.value })}
                className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Application Link or Email Address
            </label>
            <input
              type="text"
              value={editForm.applicationUrl}
              onChange={(e) => setEditForm({ ...editForm, applicationUrl: e.target.value })}
              placeholder="https://company.com/apply or jobs@company.et"
              className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1]"
            />
          </div>

          {/* Salary Grid */}
          <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <DollarSign size={14} className="text-emerald-600" />
                Compensation Details
              </span>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={editForm.isSalaryNegotiable}
                  onChange={(e) => setEditForm({ ...editForm, isSalaryNegotiable: e.target.checked })}
                  className="rounded text-[#185DF1] focus:ring-[#185DF1]"
                />
                Negotiable Salary
              </label>
            </div>

            {!editForm.isSalaryNegotiable && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Min Salary</label>
                  <input
                    type="number"
                    value={editForm.salaryMin}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        salaryMin: e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                    placeholder="e.g. 25000"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Max Salary</label>
                  <input
                    type="number"
                    value={editForm.salaryMax}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        salaryMax: e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                    placeholder="e.g. 40000"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Currency</label>
                  <select
                    value={editForm.salaryCurrency}
                    onChange={(e) => setEditForm({ ...editForm, salaryCurrency: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 cursor-pointer"
                  >
                    <option value="ETB">ETB (Ethiopian Birr)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Description & Candidate Requirements
            </label>
            <textarea
              rows={4}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#185DF1]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="px-6 py-2.5 text-xs font-bold bg-[#185DF1] hover:bg-[#031130] text-white rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save size={14} />
              {savingEdit ? "Saving..." : "Save Job Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F7FE] pb-24">
      <SuperAdminNav />

      {/* --- HEADER --- */}
      <div className="bg-gradient-to-br from-[#031130] via-[#081d4a] to-[#185DF1] pt-10 pb-20 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link
              href="/superadmin/dashboard"
              className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white font-medium mb-4 text-xs transition-colors"
            >
              <ArrowLeft size={14} /> Back to command center
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg shrink-0">
                <Briefcase size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Master Jobs Governance
                </h1>
                <p className="text-blue-100/80 text-xs md:text-sm mt-0.5">
                  Universal catalog of all listings across Ethiopia with edit popup, force-purge & status authority
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/jobs/create"
            className="bg-white text-[#185DF1] hover:bg-blue-50 font-bold py-3 px-5 rounded-xl transition-all shadow-md flex items-center gap-2 text-xs w-fit"
          >
            <PlusCircle size={16} /> Post New Vacancy
          </Link>
        </div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
          {actionMessage && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Filter Pills & Live Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === "ALL"
                    ? "bg-[#185DF1] text-white shadow-md shadow-blue-500/20"
                    : "bg-[#F3F7FE] text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                All Jobs ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("PUBLISHED")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === "PUBLISHED"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-[#F3F7FE] text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                Published Live ({stats.published})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("DRAFT")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === "DRAFT"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "bg-[#F3F7FE] text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                Drafts ({stats.drafts})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("DELETED")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === "DELETED"
                    ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                    : "bg-[#F3F7FE] text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                Pending / Deleted ({stats.pending})
              </button>
            </div>

            <div className="relative w-full lg:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, company, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3F7FE] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#185DF1] font-medium"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 font-medium">
              <div className="w-10 h-10 border-4 border-[#185DF1] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading master vacancy catalog...
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const isPendingDeletion = job.isDeleted || job.status === "PENDING_DELETION";

                return (
                  <div
                    key={job.id}
                    className="p-5 md:p-6 bg-[#F8FAFC] hover:bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#185DF1] font-extrabold shadow-sm shrink-0 uppercase border border-slate-200 overflow-hidden">
                          {job.company?.logoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={job.company.logoUrl}
                              alt={job.company.name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : job.company?.name ? (
                            job.company.name.substring(0, 2)
                          ) : (
                            "ET"
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-[#031130] text-base hover:text-[#185DF1] transition-colors">
                              <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                            </h3>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                isPendingDeletion
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : job.status === "DRAFT"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-emerald-100 text-emerald-800 border-emerald-200"
                              }`}
                            >
                              {isPendingDeletion ? "PENDING DELETION" : job.status || "PUBLISHED"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <Building2 size={13} /> {job.company?.name || "Independent Employer"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin size={13} /> {job.location || "Addis Ababa"} ({job.workplaceType || "On-site"})
                            </span>
                            <span>•</span>
                            <span>Deadline: {new Date(job.deadlineDate).toLocaleDateString()}</span>
                            {job.postedBy && (
                              <>
                                <span>•</span>
                                <span className="text-slate-400">
                                  Posted by: {job.postedBy.fullName || job.postedBy.email}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Multi-Categories & Details row */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 pl-16">
                        {job.categories &&
                          job.categories.map((jc: any, cIdx: number) => (
                            <span
                              key={cIdx}
                              className="text-[10px] font-bold bg-blue-50 text-[#185DF1] px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1"
                            >
                              <Layers size={10} />
                              {jc.category?.name || "Category"}
                            </span>
                          ))}
                        {job.experienceLevel && (
                          <span className="text-[10px] font-semibold bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md">
                            {job.experienceLevel}
                          </span>
                        )}
                        {job.salaryMin && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
                            {job.salaryMin.toLocaleString()} - {job.salaryMax?.toLocaleString()} {job.salaryCurrency}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* SuperAdmin Authority Controls */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                      {/* Status Override Selector */}
                      <select
                        value={job.status || "PUBLISHED"}
                        onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#185DF1] cursor-pointer"
                        title="Override Job Status"
                      >
                        <option value="PUBLISHED">Published Live</option>
                        <option value="DRAFT">Set to Draft</option>
                        <option value="ARCHIVED">Archive Job</option>
                      </select>

                      {/* Edit Button (Opens Centered Popup with Blurred Background) */}
                      <button
                        type="button"
                        onClick={() => openEditModal(job)}
                        className="p-2 bg-white hover:bg-blue-50 text-slate-600 hover:text-[#185DF1] rounded-xl border border-slate-200 transition-colors font-bold text-xs flex items-center gap-1 shadow-sm"
                        title="Edit Job Vacancy"
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>

                      <Link
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-[#185DF1] rounded-xl transition-colors font-bold text-xs flex items-center gap-1 shadow-sm"
                        title="View Public Listing"
                      >
                        <Eye size={15} />
                      </Link>

                      {/* SuperAdmin Force Purge */}
                      <button
                        type="button"
                        onClick={() => handleForceDelete(job.id, job.title)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-bold text-xs flex items-center gap-1 shadow-sm"
                        title="Force Delete Permanently"
                      >
                        <Trash2 size={15} />
                        <span className="hidden sm:inline">Purge</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 font-medium bg-[#F3F7FE] rounded-2xl border border-slate-200">
              <AlertCircle size={36} className="mx-auto mb-2 text-slate-300" />
              <p>No job listings matched your filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Render Edit Modal via createPortal to document.body */}
      {mounted && editModalContent && createPortal(editModalContent, document.body)}
    </div>
  );
}
