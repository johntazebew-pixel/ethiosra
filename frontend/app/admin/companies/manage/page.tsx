// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/admin/companies/manage/page.tsx
// Description: Employer & Partner Company Management for Administrators with
//              device image upload, centered popup modal with blurred background,
//              and active vacancy counters.
// ============================================================================

"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Building2,
  PlusCircle,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Globe,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import CompanyLogoUploader from "@/components/ui/CompanyLogoUploader";
import CompanyAvatar from "@/components/ui/CompanyAvatar";

export default function AdminCompaniesManagePage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get("/companies");
      setCompanies(response.data || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setErrorMessage("Your session has expired. Redirecting to login...");
        router.push("/login?redirect=/admin/companies/manage");
      } else {
        setErrorMessage("Failed to load companies.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCompanyId(null);
    setCompanyName("");
    setCompanyWebsite("");
    setCompanyLogoUrl("");
    setCompanyDescription("");
    setModalOpen(true);
  };

  const openEditModal = (comp: any) => {
    setModalMode("edit");
    setSelectedCompanyId(comp.id);
    setCompanyName(comp.name || "");
    setCompanyWebsite(comp.website || "");
    setCompanyLogoUrl(comp.logoUrl || "");
    setCompanyDescription(comp.description || "");
    setModalOpen(true);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setErrorMessage("Company name is required.");
      return;
    }

    setSubmitting(true);
    setActionMessage("");
    setErrorMessage("");

    try {
      const payload = {
        name: companyName.trim(),
        website: companyWebsite.trim() || undefined,
        logoUrl: companyLogoUrl.trim() || undefined,
        description: companyDescription.trim() || undefined,
      };

      if (modalMode === "create") {
        await api.post("/companies", payload);
        setActionMessage(`Company "${companyName}" successfully created.`);
      } else if (selectedCompanyId) {
        await api.patch(`/companies/${selectedCompanyId}`, payload);
        setActionMessage(`Company "${companyName}" successfully updated.`);
      }

      setModalOpen(false);
      fetchCompanies();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to save company. Please verify details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCompany = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? If there are jobs attached, deletion may fail or cascade.`
      )
    ) {
      return;
    }

    setActionMessage("");
    setErrorMessage("");

    try {
      await api.delete(`/companies/${id}`);
      setActionMessage(`Company "${name}" was successfully removed.`);
      fetchCompanies();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to delete company. It may still have active job vacancies attached."
      );
    }
  };

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return companies.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.website?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [companies, searchQuery]);

  // Modal content with blurred background
  const modalContent = modalOpen && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Dark Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => setModalOpen(false)}
      />

      {/* Centered Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 my-auto overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => setModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-neutral-50 text-[#111111] flex items-center justify-center font-bold">
            <Building2 size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#111111]">
              {modalMode === "create" ? "Register New Company" : "Edit Company Profile"}
            </h3>
            <p className="text-xs text-slate-500">
              Update organization branding, profile info, and official links.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveCompany} className="space-y-4 mt-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Commercial Bank of Ethiopia (CBE)"
              className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Website URL
            </label>
            <input
              type="url"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="https://company.et"
              className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
          </div>

          {/* Local Device Image Uploader Component */}
          <CompanyLogoUploader
            value={companyLogoUrl}
            onChange={(url) => setCompanyLogoUrl(url)}
            companyName={companyName}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Bio & Description
            </label>
            <textarea
              rows={3}
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Brief overview of the organization, core industry focus, and mission..."
              className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold bg-[#111111] hover:bg-[#111111] text-white rounded-xl transition-all shadow-md shadow-neutral-500/20 disabled:opacity-50"
            >
              {submitting ? "Saving..." : modalMode === "create" ? "Register Company" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-br from-[#111111] via-[#333333] to-[#111111] pt-12 pb-24 px-4 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-neutral-200 hover:text-white font-medium mb-6 text-sm transition-colors"
            >
              <ArrowLeft size={16} /> Back to dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg shrink-0">
                <Building2 size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Manage Partner Companies</h1>
                <p className="text-neutral-100/80 mt-1">
                  Register new hiring employers, upload logos from your computer, and manage profiles
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-white text-[#111111] hover:bg-neutral-50 font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 w-fit text-sm"
          >
            <PlusCircle size={18} /> Register New Company
          </button>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-10">
          {actionMessage && (
            <div className="mb-6 bg-neutral-50 border border-neutral-200 text-neutral-700 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-2">
              <CheckCircle2 size={18} className="text-neutral-500 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Search Bar & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#111111]">
                Registered Organizations ({filteredCompanies.length})
              </h2>
              <p className="text-xs text-slate-400">
                Partner employers, active vacancies, and official logos
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company name or website..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#111111] font-medium"
              />
            </div>
          </div>

          {/* Companies Grid */}
          {loading ? (
            <div className="py-16 text-center text-slate-400 font-medium">
              <div className="w-10 h-10 border-4 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading partner organizations...
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((comp) => (
                <div
                  key={comp.id}
                  className="p-6 bg-[#F8FAFC] hover:bg-white rounded-2xl border border-slate-200/80 hover:border-neutral-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      {/* Logo or Initials Avatar */}
                      <CompanyAvatar
                        name={comp.name}
                        logoUrl={comp.logoUrl}
                        fallback="CO"
                        className="w-14 h-14 rounded-2xl border border-slate-200 shadow-sm shrink-0 text-xl text-[#111111]"
                      />

                      <span className="text-xs font-bold text-slate-600 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100 flex items-center gap-1">
                        <Briefcase size={12} className="text-[#111111]" />
                        {comp.jobs ? comp.jobs.length : 0} Vacancies
                      </span>
                    </div>

                    <h3 className="font-bold text-[#111111] text-base hover:text-[#111111] transition-colors mb-1">
                      <Link href={`/companies/${comp.id}`}>{comp.name}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {comp.description || "Verified employer profile on the EthioSira platform."}
                    </p>

                    {comp.website && (
                      <a
                        href={comp.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#111111] hover:underline font-semibold"
                      >
                        <Globe size={13} />
                        <span className="truncate max-w-[200px]">{comp.website}</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => openEditModal(comp)}
                      className="p-2 bg-white hover:bg-neutral-50 text-slate-600 hover:text-[#111111] rounded-xl border border-slate-200 transition-colors text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                      title="Edit Company"
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCompany(comp.id, comp.name)}
                      className="p-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl border border-slate-200 transition-colors text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                      title="Delete Company"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 font-medium bg-[#F7F7F7] rounded-2xl border border-slate-200">
              <AlertCircle size={36} className="mx-auto mb-2 text-slate-300" />
              <p>No employers found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Render Portal Modal directly into document.body */}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </div>
  );
}
