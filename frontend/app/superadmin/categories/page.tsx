// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/superadmin/categories/page.tsx
// Description: Master Categories & Taxonomies Management for SuperAdmin with
//              direct category creation, editing, and deletion.
// ============================================================================

"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Layers,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Tag,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import SuperAdminNav from "@/components/layout/SuperAdminNav";

export default function SuperAdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("DEPARTMENT");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCategoryId(null);
    setCategoryName("");
    setCategoryType("DEPARTMENT");
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setModalMode("edit");
    setSelectedCategoryId(cat.id);
    setCategoryName(cat.name || "");
    setCategoryType(cat.type || "DEPARTMENT");
    setModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setErrorMessage("Category name is required.");
      return;
    }

    setSubmitting(true);
    setActionMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: categoryName.trim(),
        type: categoryType.trim() || "Sector",
      };

      if (modalMode === "create") {
        await api.post("/categories", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActionMessage(`Category "${categoryName}" was successfully created.`);
      } else if (selectedCategoryId) {
        await api.patch(`/categories/${selectedCategoryId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActionMessage(`Category "${categoryName}" was successfully updated.`);
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to save category. Please verify inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${name}"? Jobs attached to this category might lose their tagging.`
      )
    ) {
      return;
    }

    setActionMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMessage(`Category "${name}" was successfully removed.`);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to delete category. It may still be linked to active vacancies."
      );
    }
  };

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.type?.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

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
                <Layers size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Job Categories & Taxonomies
                </h1>
                <p className="text-neutral-100/80 text-xs md:text-sm mt-0.5">
                  Organize platform specializations, industry tags, and job classifications.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="bg-white text-[#111111] hover:bg-neutral-50 font-bold py-3 px-5 rounded-xl transition-all shadow-md flex items-center gap-2 text-xs w-fit"
          >
            <PlusCircle size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-10">
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

          {/* Search Bar & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#111111]">
              Active Categories ({filteredCategories.length})
            </h2>

            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by category name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#111111] font-medium"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 font-medium">
              <div className="w-10 h-10 border-4 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading categories...
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-[#F8FAFC] hover:bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-neutral-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {cat.type || "Sector"}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#111111] flex items-center gap-1.5 mt-1">
                      <Tag size={14} className="text-[#111111] shrink-0" />
                      <span>{cat.name}</span>
                    </h3>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 bg-white hover:bg-neutral-50 text-slate-500 hover:text-[#111111] rounded-lg border border-slate-200 transition-colors text-xs font-bold inline-flex items-center gap-1"
                      title="Edit Category"
                    >
                      <Edit2 size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg border border-slate-200 transition-colors text-xs font-bold inline-flex items-center gap-1"
                      title="Delete Category"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 font-medium bg-[#F7F7F7] rounded-2xl border border-slate-200">
              <AlertCircle size={36} className="mx-auto mb-2 text-slate-300" />
              <p>No categories found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Render Portal Modal directly into document.body */}
      {mounted &&
        modalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Blurred Dark Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
              onClick={() => setModalOpen(false)}
            />

            {/* Centered Modal Card */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 my-auto overflow-hidden animate-in zoom-in-95 duration-200">
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
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#111111]">
                    {modalMode === "create" ? "Add New Category" : "Edit Category"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Standardized taxonomy used for job filters and candidate matching.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 mt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Artificial Intelligence & Data Science"
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Classification Type
                  </label>
                  <select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer"
                  >
                    <option value="DEPARTMENT">Department / Sector</option>
                    <option value="EXPERIENCE">Experience Level</option>
                    <option value="EMPLOYMENT_TYPE">Employment / Contract Type</option>
                    <option value="SPECIALIZATION">Specialization / Domain</option>
                    <option value="SECTOR">Industry / Ecosystem</option>
                  </select>
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
                    {submitting ? "Saving..." : modalMode === "create" ? "Create Category" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
