// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/admin/jobs/create/page.tsx
// Description: Comprehensive professional job posting studio (EthioJobs & LinkedIn style)
//              with multi-category selection, compensation, skills chips, and live preview.
// ============================================================================

"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  Link as LinkIcon,
  ArrowLeft,
  PlusCircle,
  MapPin,
  DollarSign,
  Layers,
  Award,
  CheckCircle2,
  X,
  Search,
  Sparkles,
  Globe,
  Send,
  Mail,
  FileText,
  Clock,
  Users,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import CompanyLogoUploader from "@/components/ui/CompanyLogoUploader";
import CompanyAvatar from "@/components/ui/CompanyAvatar";

const ETHIOPIAN_CITIES = [
  "Addis Ababa",
  "Hawassa",
  "Dire Dawa",
  "Bahir Dar",
  "Adama (Nazret)",
  "Mekelle",
  "Jimma",
  "Gondar",
  "Dessie",
  "Bishoftu",
  "Remote / All Ethiopia",
];

const WORKPLACE_TYPES = [
  { id: "ON_SITE", label: "On-site", desc: "Work from company office" },
  { id: "HYBRID", label: "Hybrid", desc: "Mix of office and remote" },
  { id: "REMOTE", label: "Remote", desc: "Work from anywhere in Ethiopia" },
];

const EMPLOYMENT_TYPES = [
  { id: "FULL_TIME", label: "Full-Time" },
  { id: "PART_TIME", label: "Part-Time" },
  { id: "CONTRACT", label: "Contractual / Project" },
  { id: "INTERNSHIP", label: "Internship / Graduate Trainee" },
  { id: "FREELANCE", label: "Freelance" },
];

const EXPERIENCE_LEVELS = [
  { id: "ENTRY_LEVEL", label: "Entry-Level (0 - 1 years)" },
  { id: "JUNIOR", label: "Junior Level (1 - 3 years)" },
  { id: "MID_LEVEL", label: "Mid-Level (3 - 5 years)" },
  { id: "SENIOR", label: "Senior Professional (5 - 8 years)" },
  { id: "EXECUTIVE", label: "Lead / Director / Executive (8+ years)" },
];

const EDUCATION_LEVELS = [
  "High School Diploma",
  "Technical / TVET Certificate",
  "Diploma (College)",
  "Bachelor's Degree (BA / BSc)",
  "Master's Degree (MA / MSc / MBA)",
  "Doctorate / PhD",
  "Other Professional Certification",
];

const COMMON_BENEFITS = [
  "Comprehensive Health Insurance",
  "Transportation Allowance / Staff Bus",
  "Mobile & Internet Allowance",
  "Performance & Annual Bonuses",
  "Pension & Provident Fund",
  "Paid Training & Certifications",
  "Flexible Working Hours",
  "Subsidized Cafeteria / Lunch",
];

const SUGGESTED_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
  "PostgreSQL",
  "Accounting",
  "Financial Analysis",
  "Project Management",
  "Customer Support",
  "Digital Marketing",
  "Graphic Design",
  "Sales & Negotiation",
  "Human Resources",
  "Data Analysis",
];

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [companies, setCompanies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  // SECTION 1: Basic Information & Multi-Categories
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [mounted, setMounted] = useState(false);

  // Quick Company Modal State
  const [quickCompanyModalOpen, setQuickCompanyModalOpen] = useState(false);
  const [quickCompName, setQuickCompName] = useState("");
  const [quickCompWebsite, setQuickCompWebsite] = useState("");
  const [quickCompLogo, setQuickCompLogo] = useState("");
  const [quickCompDesc, setQuickCompDesc] = useState("");
  const [savingQuickComp, setSavingQuickComp] = useState(false);
  const [quickCompError, setQuickCompError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (quickCompanyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [quickCompanyModalOpen]);

  const handleSaveQuickCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCompName.trim()) {
      setQuickCompError("Company name is required.");
      return;
    }
    setSavingQuickComp(true);
    setQuickCompError("");
    try {
      const res = await api.post("/companies", {
        name: quickCompName.trim(),
        website: quickCompWebsite.trim() || undefined,
        logoUrl: quickCompLogo.trim() || undefined,
        description: quickCompDesc.trim() || undefined,
      });
      const newComp = res.data;
      setCompanies((prev) => [newComp, ...prev]);
      setCompanyId(newComp.id);
      setQuickCompanyModalOpen(false);
      setQuickCompName("");
      setQuickCompWebsite("");
      setQuickCompLogo("");
      setQuickCompDesc("");
    } catch (err: any) {
      setQuickCompError(err.response?.data?.message || "Failed to create company.");
    } finally {
      setSavingQuickComp(false);
    }
  };

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [location, setLocation] = useState("Addis Ababa");
  const [workplaceType, setWorkplaceType] = useState("ON_SITE");
  const [employmentType, setEmploymentType] = useState("FULL_TIME");

  // SECTION 2: Career, Experience & Vacancy
  const [experienceLevel, setExperienceLevel] = useState("MID_LEVEL");
  const [minExperienceYears, setMinExperienceYears] = useState(2);
  const [educationLevel, setEducationLevel] = useState("Bachelor's Degree (BA / BSc)");
  const [positionsCount, setPositionsCount] = useState(1);
  const [genderPreference, setGenderPreference] = useState("ANY");

  // SECTION 3: Skills Required (Interactive Tags)
  const [skillsList, setSkillsList] = useState<string[]>(["Communication", "Teamwork"]);
  const [skillInput, setSkillInput] = useState("");

  // SECTION 4: Compensation & Benefits
  const [isSalaryNegotiable, setIsSalaryNegotiable] = useState(true);
  const [salaryCurrency, setSalaryCurrency] = useState("ETB");
  const [salaryMin, setSalaryMin] = useState<number | "">("");
  const [salaryMax, setSalaryMax] = useState<number | "">("");
  const [salaryPeriod, setSalaryPeriod] = useState("MONTHLY");
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([
    "Comprehensive Health Insurance",
    "Mobile & Internet Allowance",
  ]);

  // SECTION 5: Description, Responsibilities & Qualifications
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");

  // SECTION 6: Application Method & Deadline
  const [applicationMethod, setApplicationMethod] = useState<"WEBSITE" | "TELEGRAM" | "EMAIL" | "GOOGLE_FORM">("WEBSITE");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [publishStatus, setPublishStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");

  // Fetch Companies and Categories
  useEffect(() => {
    async function fetchFormData() {
      try {
        const [compRes, catRes] = await Promise.all([
          api.get("/companies"),
          api.get("/categories"),
        ]);
        const compList = compRes.data || [];
        const catList = catRes.data || [];
        setCompanies(compList);
        setCategories(catList);

        if (compList.length > 0) setCompanyId(compList[0].id);
        if (catList.length > 0) setSelectedCategoryIds([catList[0].id]);

        // Default deadline: 30 days from today
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        setDeadlineDate(futureDate.toISOString().split("T")[0]);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      } finally {
        setDataLoading(false);
      }
    }
    fetchFormData();
  }, []);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const toggleBenefit = (benefit: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(benefit) ? prev.filter((b) => b !== benefit) : [...prev, benefit]
    );
  };

  const selectedCompany = useMemo(() => {
    return companies.find((c) => c.id === companyId);
  }, [companies, companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategoryIds.length === 0) {
      setErrorMessage("Please select at least one job category.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!deadlineDate) {
      setErrorMessage("Please specify the application deadline date.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        title: title.trim(),
        description: description.trim(),
        deadlineDate: new Date(deadlineDate).toISOString(),
        applicationMethod,
        applicationUrl: applicationUrl.trim(),
        companyId,
        categoryIds: selectedCategoryIds,
        location,
        workplaceType,
        employmentType,
        experienceLevel,
        minExperienceYears: Number(minExperienceYears) || 0,
        educationLevel,
        positionsCount: Number(positionsCount) || 1,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        salaryCurrency,
        salaryPeriod,
        isSalaryNegotiable,
        responsibilities: responsibilities.trim() || undefined,
        qualifications: qualifications.trim() || undefined,
        skillsRequired: skillsList,
        benefits: selectedBenefits,
        genderPreference,
        status: publishStatus,
      };

      await api.post("/jobs", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Job opportunity has been published successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        router.push("/admin/jobs/manage");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to post job. Please verify all inputs and try again."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading Job Posting Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      {/* --- HERO HEADER --- */}
      <div className="bg-gradient-to-br from-[#111111] via-[#333333] to-[#111111] pt-12 pb-24 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-neutral-200 hover:text-white font-medium text-sm transition-colors"
            >
              <ArrowLeft size={16} /> Back to dashboard
            </Link>

            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 transition-all"
            >
              {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showPreview ? "Hide Preview" : "Preview Job Card"}</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-xl shrink-0">
              <PlusCircle size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Post a Professional Job Vacancy
              </h1>
              <p className="text-neutral-100/90 text-sm mt-1">
                Publish high-visibility employment opportunities with multi-categories, compensation, and qualifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="max-w-5xl mx-auto px-4 -mt-12">
        {/* LIVE PREVIEW CARD (Conditional) */}
        {showPreview && (
          <div className="mb-8 bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-[#111111] animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                <Sparkles size={16} /> Candidate Live Preview
              </span>
              <span className="text-xs text-slate-400">
                This is how the vacancy card appears on search results
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <CompanyAvatar
                  name={selectedCompany?.name}
                  logoUrl={selectedCompany?.logoUrl}
                  fallback="ET"
                  className="w-14 h-14 bg-neutral-50 text-[#111111] text-xl rounded-2xl border border-neutral-200 shadow-sm shrink-0"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-[#111111]">
                    {title || "Untitled Job Vacancy"}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-bold text-[#111111]">
                      {selectedCompany?.name || "Select a Company"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {location} ({workplaceType})
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-neutral-700 bg-neutral-50 px-2 py-0.5 rounded-md">
                      {isSalaryNegotiable
                        ? "Salary Negotiable"
                        : `${salaryMin || "Min"} - ${salaryMax || "Max"} ${salaryCurrency}/${salaryPeriod.toLowerCase()}`}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 md:justify-end">
                {selectedCategoryIds.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  return (
                    <span
                      key={id}
                      className="text-[11px] font-bold bg-neutral-50 text-[#111111] px-2.5 py-1 rounded-lg border border-neutral-200"
                    >
                      {cat?.name || "Category"}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MAIN FORM */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-10">
          {successMessage && (
            <div className="mb-8 bg-neutral-50 border border-neutral-200 text-neutral-800 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-3">
              <CheckCircle2 size={20} className="text-neutral-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* ============================================================== */}
            {/* SECTION 1: BASIC INFORMATION & MULTI-CATEGORY SELECTION */}
            {/* ============================================================== */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Briefcase size={20} className="text-[#111111]" />
                  <span>1. Job Details & Multi-Category Selection</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  General role parameters and target candidate specialties.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer (Node.js & PostgreSQL)"
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm"
                  />
                </div>

                {/* Hiring Company */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Hiring Company <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setQuickCompanyModalOpen(true)}
                      className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1"
                    >
                      <PlusCircle size={13} /> + New Company
                    </button>
                  </div>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-4 top-3.5 text-slate-400" />
                    <select
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm cursor-pointer"
                    >
                      {companies.map((comp) => (
                        <option key={comp.id} value={comp.id}>
                          {comp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Job Location City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Location / City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-3.5 text-slate-400" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm cursor-pointer"
                    >
                      {ETHIOPIAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* MULTI-SELECT CATEGORIES CARD */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers size={16} className="text-[#111111]" />
                      <span>Select Job Categories (Multi-select)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select one or multiple job categories so candidates can find this listing across different filters.
                    </p>
                  </div>

                  <span className="text-xs font-bold bg-neutral-100 text-[#111111] px-3 py-1 rounded-full w-fit">
                    {selectedCategoryIds.length} Selected
                  </span>
                </div>

                {/* Quick Search for Categories */}
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories (e.g. Technology, Finance, Engineering, Healthcare)..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                {/* Category Badges Grid */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {filteredCategories.map((cat) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 border ${
                          isSelected
                            ? "bg-[#111111] text-white border-[#111111] shadow-sm shadow-neutral-500/20"
                            : "bg-white text-slate-700 border-slate-200 hover:border-neutral-300 hover:bg-neutral-50/50"
                        }`}
                      >
                        {isSelected ? <Check size={13} /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>}
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workplace & Employment Type Pills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Workplace Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Workplace Arrangement
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {WORKPLACE_TYPES.map((wp) => (
                      <button
                        key={wp.id}
                        type="button"
                        onClick={() => setWorkplaceType(wp.id)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          workplaceType === wp.id
                            ? "bg-[#111111] text-white border-[#111111] shadow-md shadow-neutral-500/20"
                            : "bg-[#F7F7F7] text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {wp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Employment Contract Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    {EMPLOYMENT_TYPES.map((et) => (
                      <option key={et.id} value={et.id}>
                        {et.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* SECTION 2: CANDIDATE QUALIFICATIONS & EXPERIENCE */}
            {/* ============================================================== */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Award size={20} className="text-[#111111]" />
                  <span>2. Candidate Qualifications & Requirements</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seniority, experience requirements, and education criteria.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Career Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Seniority Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    {EXPERIENCE_LEVELS.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Experience (Years) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Minimum Experience (Years)
                  </label>
                  <select
                    value={minExperienceYears}
                    onChange={(e) => setMinExperienceYears(Number(e.target.value))}
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    <option value={0}>0 Years (Fresh Graduate)</option>
                    <option value={1}>1 Year</option>
                    <option value={2}>2 Years</option>
                    <option value={3}>3 Years</option>
                    <option value={4}>4 Years</option>
                    <option value={5}>5 Years</option>
                    <option value={7}>7+ Years</option>
                    <option value={10}>10+ Years (Senior Lead)</option>
                  </select>
                </div>

                {/* Highest Education Required */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Minimum Education
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    {EDUCATION_LEVELS.map((ed) => (
                      <option key={ed} value={ed}>
                        {ed}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Positions Count */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Vacancies / Open Positions
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={positionsCount}
                    onChange={(e) => setPositionsCount(Number(e.target.value))}
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm"
                  />
                </div>

                {/* Gender Preference */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Gender Preference
                  </label>
                  <select
                    value={genderPreference}
                    onChange={(e) => setGenderPreference(e.target.value)}
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    <option value="ANY">Any (Equal Opportunity Employer)</option>
                    <option value="FEMALE">Female Candidates Strongly Encouraged</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>
              </div>

              {/* REQUIRED SKILLS CHIPS INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Required Key Skills (Tags)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                    placeholder="Type a skill and press Enter (e.g. Next.js, Financial Audit, Sales)..."
                    className="flex-1 bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(skillInput)}
                    className="bg-slate-900 hover:bg-[#111111] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    Add Skill
                  </button>
                </div>

                {/* Selected Skills Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 bg-neutral-50 text-[#111111] border border-neutral-200 px-3 py-1 rounded-lg text-xs font-bold"
                    >
                      <Award size={13} />
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Suggested Skill Tags */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                  <span className="font-semibold text-slate-500 mr-1">Suggestions:</span>
                  {SUGGESTED_SKILLS.filter((s) => !skillsList.includes(s))
                    .slice(0, 8)
                    .map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addSkill(s)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* SECTION 3: COMPENSATION, SALARY & BENEFITS */}
            {/* ============================================================== */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <DollarSign size={20} className="text-[#111111]" />
                  <span>3. Compensation, Salary Range & Benefits</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Attractive pay details and candidate perks boost response rates.
                </p>
              </div>

              {/* Salary Negotiable Toggle */}
              <div className="p-4 bg-neutral-50/70 border border-neutral-200 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-neutral-950 text-sm">
                    Salary is Negotiable / Competitive
                  </p>
                  <p className="text-neutral-800/80 text-xs mt-0.5">
                    If enabled, &quot;Competitive / Negotiable&quot; will be displayed to job seekers.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isSalaryNegotiable}
                  onChange={(e) => setIsSalaryNegotiable(e.target.checked)}
                  className="w-5 h-5 accent-[#111111] rounded cursor-pointer"
                />
              </div>

              {/* Optional Fixed Salary Inputs */}
              {!isSalaryNegotiable && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-[#F8FAFC] border border-slate-200 rounded-2xl animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Currency
                    </label>
                    <select
                      value={salaryCurrency}
                      onChange={(e) => setSalaryCurrency(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold text-sm"
                    >
                      <option value="ETB">ETB (Ethiopian Birr)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Minimum Salary
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 25000"
                      value={salaryMin}
                      onChange={(e) =>
                        setSalaryMin(e.target.value ? Number(e.target.value) : "")
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 45000"
                      value={salaryMax}
                      onChange={(e) =>
                        setSalaryMax(e.target.value ? Number(e.target.value) : "")
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Pay Frequency
                    </label>
                    <select
                      value={salaryPeriod}
                      onChange={(e) => setSalaryPeriod(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold text-sm"
                    >
                      <option value="MONTHLY">Per Month</option>
                      <option value="YEARLY">Per Year</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Common Benefits Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Company Perks & Employee Benefits
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COMMON_BENEFITS.map((benefit) => {
                    const isChecked = selectedBenefits.includes(benefit);
                    return (
                      <button
                        key={benefit}
                        type="button"
                        onClick={() => toggleBenefit(benefit)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                          isChecked
                            ? "bg-neutral-50/80 border-[#111111] text-[#111111]"
                            : "bg-[#F7F7F7] border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? "bg-[#111111] border-[#111111] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check size={12} />}
                        </div>
                        <span>{benefit}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* SECTION 4: DETAILED JOB DESCRIPTION & RESPONSIBILITIES */}
            {/* ============================================================== */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <FileText size={20} className="text-[#111111]" />
                  <span>4. Job Description & Responsibilities</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed responsibilities and requirements for interested candidates.
                </p>
              </div>

              {/* Role Overview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Job Overview / Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an engaging overview of the role, team, and organizational mission..."
                  className="w-full bg-[#F7F7F7] border border-slate-200 rounded-2xl p-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm leading-relaxed"
                />
              </div>

              {/* Key Responsibilities */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Key Responsibilities & Duties
                </label>
                <textarea
                  rows={4}
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="• Lead architecture and implementation of scalable web services&#10;• Collaborate with cross-functional product and design teams&#10;• Maintain continuous integration and automated test suites"
                  className="w-full bg-[#F7F7F7] border border-slate-200 rounded-2xl p-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm leading-relaxed"
                />
              </div>

              {/* Requirements & Qualifications */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Qualifications & Requirements
                </label>
                <textarea
                  rows={4}
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="• Bachelor's degree in Computer Science, Software Engineering, or related field&#10;• 3+ years of experience with React, Node.js, and relational databases&#10;• Strong communication skills in English and Amharic"
                  className="w-full bg-[#F7F7F7] border border-slate-200 rounded-2xl p-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* ============================================================== */}
            {/* SECTION 5: APPLICATION METHOD & DEADLINE */}
            {/* ============================================================== */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Send size={20} className="text-[#111111]" />
                  <span>5. Application Channel & Deadline</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  How job seekers submit applications and the closing date.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Application Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={applicationMethod}
                    onChange={(e) => setApplicationMethod(e.target.value as any)}
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    <option value="WEBSITE">Official Website / Career Portal</option>
                    <option value="EMAIL">Direct Email Application</option>
                    <option value="TELEGRAM">Telegram Bot or Channel</option>
                    <option value="GOOGLE_FORM">Google Form / External Link</option>
                  </select>
                </div>

                {/* Application Deadline */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Application Deadline Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={deadlineDate}
                      onChange={(e) => setDeadlineDate(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Application URL / Email */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Application Link, Email, or Handle <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon size={18} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type="url"
                      required
                      value={applicationUrl}
                      onChange={(e) => setApplicationUrl(e.target.value)}
                      placeholder={
                        applicationMethod === "TELEGRAM"
                          ? "https://t.me/ethiosira_jobs_bot"
                          : applicationMethod === "EMAIL"
                          ? "https://mailto:recruitment@company.com"
                          : "https://company.com/careers/apply"
                      }
                      className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Publication Status Selector */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-[#111111] text-sm">Listing Visibility</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Choose whether this job is published live immediately or saved as draft.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPublishStatus("PUBLISHED")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      publishStatus === "PUBLISHED"
                        ? "bg-neutral-600 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    ● Publish Live
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishStatus("DRAFT")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      publishStatus === "DRAFT"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>

            {/* FORM ACTIONS */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                All vacancy details will be indexed across EthioSira search and candidate alerts.
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm"
                >
                  {showPreview ? "Hide Preview" : "Preview"}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#111111] hover:bg-[#111111] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md shadow-neutral-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <PlusCircle size={18} />
                  <span>{loading ? "Publishing Opportunity..." : "Publish Job Vacancy"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Company Modal via createPortal */}
      {mounted &&
        quickCompanyModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
              onClick={() => setQuickCompanyModalOpen(false)}
            />

            <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 my-auto overflow-hidden animate-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setQuickCompanyModalOpen(false)}
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
                  <h3 className="text-xl font-extrabold text-[#111111]">Quick Register Company</h3>
                  <p className="text-xs text-slate-500">
                    Add organization branding with device logo upload for this vacancy.
                  </p>
                </div>
              </div>

              {quickCompError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{quickCompError}</span>
                </div>
              )}

              <form onSubmit={handleSaveQuickCompany} className="space-y-4 mt-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={quickCompName}
                    onChange={(e) => setQuickCompName(e.target.value)}
                    placeholder="e.g. Ethiopian Airlines Group"
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={quickCompWebsite}
                    onChange={(e) => setQuickCompWebsite(e.target.value)}
                    placeholder="https://company.et"
                    className="w-full bg-[#F7F7F7] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  />
                </div>

                <CompanyLogoUploader
                  value={quickCompLogo}
                  onChange={(url) => setQuickCompLogo(url)}
                  companyName={quickCompName}
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setQuickCompanyModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingQuickComp}
                    className="px-6 py-2.5 text-xs font-bold bg-[#111111] hover:bg-[#111111] text-white rounded-xl transition-all shadow-md shadow-neutral-500/20 disabled:opacity-50"
                  >
                    {savingQuickComp ? "Saving..." : "Save & Select Company"}
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