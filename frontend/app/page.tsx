// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/page.tsx
// Description: Dynamic homepage with live search, category filtering, and job listings.
// ============================================================================

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Code,
  Calculator,
  HeartPulse,
  Building2,
  Calendar,
  ExternalLink,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsResponse, categoriesResponse] = await Promise.all([
          api.get("/jobs"),
          api.get("/categories"),
        ]);
        setJobs(jobsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        setJobs([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter jobs based on search query and category
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory ||
        job.categories?.some(
          (c: any) =>
            c.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
        );

      return matchesSearch && matchesCategory;
    });
  }, [jobs, searchQuery, selectedCategory]);

  const topCategories = categories.slice(0, 8);

  return (
    <div className="flex flex-col items-center w-full bg-[#F3F7FE] min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="w-full bg-gradient-to-br from-[#031130] via-[#081d4a] to-[#185DF1] text-white py-24 md:py-32 px-4 relative overflow-hidden rounded-b-[3rem] shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#185DF1] rounded-full mix-blend-screen filter blur-[120px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400 rounded-full mix-blend-screen filter blur-[130px] opacity-20 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs md:text-sm font-semibold mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Over 1,000+ Opportunities Across Ethiopia</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Discover Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-300">
              Career Journey
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            EthioSira connects skilled professionals with top companies, institutions, and startups in Ethiopia.
          </p>

          {/* Interactive Search Bar */}
          <div className="bg-white p-2.5 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto border border-white/40">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full md:w-auto">
              <Search className="text-[#185DF1] shrink-0" size={22} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, company, or keyword..."
                className="w-full bg-transparent text-[#031130] font-medium outline-none placeholder:text-slate-400 text-sm md:text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                const element = document.getElementById("job-listings");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full md:w-auto bg-[#185DF1] hover:bg-[#031130] text-white font-bold py-3.5 px-8 rounded-xl md:rounded-full transition-all duration-300 shadow-md hover:shadow-lg shrink-0 text-sm md:text-base"
            >
              Search Opportunities
            </button>
          </div>

          {/* Quick stats banner */}
          <div className="mt-12 grid grid-cols-3 max-w-2xl mx-auto gap-4 pt-8 border-t border-white/10 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white">{jobs.length}</p>
              <p className="text-xs md:text-sm text-blue-200/80">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white">{categories.length}</p>
              <p className="text-xs md:text-sm text-blue-200/80">Specialties</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white">100%</p>
              <p className="text-xs md:text-sm text-blue-200/80">Verified Employers</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK CATEGORIES SECTION --- */}
      <section className="w-full max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#185DF1] font-bold text-sm tracking-wider uppercase mb-1">
              <Sparkles size={16} />
              <span>Explore Roles</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#031130] tracking-tight">
              Popular Categories
            </h2>
            <p className="text-slate-500 mt-2 text-base">
              Click a sector to filter live job listings instantly.
            </p>
          </div>

          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl transition-colors"
            >
              <X size={14} /> Clear Category Filter ({selectedCategory})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium bg-white rounded-3xl border border-slate-200">
              Loading categories...
            </div>
          ) : topCategories.length > 0 ? (
            topCategories.map((cat: any, idx: number) => {
              const icons = [Code, Calculator, HeartPulse, Briefcase, TrendingUp, Building2];
              const Icon = icons[idx % icons.length];
              const isSelected =
                selectedCategory?.toLowerCase() === cat.name?.toLowerCase();

              return (
                <div
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : cat.name)
                  }
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? "bg-gradient-to-br from-[#185DF1] to-[#0a40aa] text-white shadow-xl shadow-blue-500/20 border-transparent scale-[1.02]"
                      : "bg-white border-slate-200/80 hover:border-[#185DF1]/40 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#F3F7FE] text-[#185DF1] group-hover:bg-[#185DF1] group-hover:text-white"
                    }`}
                  >
                    <Icon size={26} />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-bold mb-1 ${
                        isSelected ? "text-white" : "text-[#031130]"
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className={`text-xs font-medium ${
                        isSelected ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {cat.type === "DEPARTMENT" ? "Department" : "Specialty"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-200">
              No categories found.
            </div>
          )}
        </div>
      </section>

      {/* --- ALL JOB LISTINGS SECTION --- */}
      <section
        id="job-listings"
        className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header with dynamic count */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#185DF1] font-bold text-sm tracking-wider uppercase mb-1">
                <Briefcase size={16} />
                <span>Verified Jobs</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#031130] tracking-tight">
                {selectedCategory
                  ? `${selectedCategory} Positions`
                  : "All Open Positions"}
              </h2>
              <p className="text-slate-500 mt-2 text-base">
                Showing {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"}
                {searchQuery ? ` matching "${searchQuery}"` : ""}.
              </p>
            </div>

            {/* Quick reset if filter active */}
            {(searchQuery || selectedCategory) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="text-sm font-bold text-[#185DF1] hover:underline flex items-center gap-1"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Job Cards */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="py-16 text-center text-slate-400 font-medium bg-slate-50 rounded-3xl border border-slate-200">
                Loading job listings...
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job: any) => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200/90 hover:border-[#185DF1]/50 p-6 md:p-7 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 group"
                >
                  <div className="flex items-start md:items-center gap-5">
                    {/* Company Initial / Logo Circle */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center font-extrabold text-xl text-[#185DF1] border border-blue-200/50 uppercase shrink-0 shadow-sm">
                      {job.company?.name ? job.company.name.substring(0, 2) : "Co"}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-xl font-bold text-[#031130] group-hover:text-[#185DF1] transition-colors">
                          {job.title}
                        </h3>
                        {job.workplaceType && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            {job.workplaceType}
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                          {job.applicationMethod}
                        </span>
                      </div>

                      <p className="text-slate-600 font-medium text-sm flex flex-wrap items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 font-bold text-[#185DF1]">
                          <Building2 size={16} />
                          <span>{job.company?.name || "Independent Employer"}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <MapPin size={13} /> {job.location || "Addis Ababa"}
                        </span>
                        {job.isSalaryNegotiable && (
                          <>
                            <span>•</span>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              Negotiable
                            </span>
                          </>
                        )}
                      </p>

                      {/* Multi-Categories Tags */}
                      {job.categories && job.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {job.categories.slice(0, 3).map((jc: any, cIdx: number) => (
                            <span
                              key={cIdx}
                              className="text-[10px] font-bold text-[#185DF1] bg-blue-50 px-2 py-0.5 rounded border border-blue-100"
                            >
                              {jc.category?.name}
                            </span>
                          ))}
                          {job.categories.length > 3 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{job.categories.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-slate-500 text-sm line-clamp-2 max-w-2xl font-light">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Deadline */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Calendar size={14} /> Deadline: {new Date(job.deadlineDate).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="bg-[#F3F7FE] text-[#185DF1] hover:bg-[#185DF1] hover:text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-sm inline-flex items-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-slate-50 rounded-3xl border border-slate-200 p-8">
                <Briefcase size={44} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-xl font-bold text-slate-700 mb-1">
                  No matching jobs found
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Try adjusting your search query or selecting a different category to see available opportunities.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="bg-[#185DF1] text-white font-bold py-2.5 px-6 rounded-xl text-sm"
                >
                  Show All Jobs
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}