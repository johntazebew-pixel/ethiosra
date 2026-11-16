// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/companies/page.tsx
// Description: The client-side Companies directory with live search and profiles.
// ============================================================================

"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Building2, Briefcase, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import CompanyAvatar from "@/components/ui/CompanyAvatar";
import type { Company } from "@/types";

type ListedCompany = Company & { jobs?: { id: string }[] };

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<ListedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await api.get("/companies");
        setCompanies(response.data || []);
      } catch {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        q === "" ||
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    });
  }, [companies, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-16">
      {/* --- HEADER SECTION --- */}
      <div className="px-4 pb-20 pt-14 text-center sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-4 py-1.5 text-xs font-semibold text-neutral-800">
            <Building2 size={14} />
            <span>Verified Organizations</span>
          </div>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-[#111111] md:text-5xl">
            Top Employers in Ethiopia
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Discover premier companies, explore their teams and open positions,
            and apply directly.
          </p>
        </div>
      </div>

      {/* --- SEARCH BAR (Floating) --- */}
      <div className="relative z-20 mx-auto mb-10 -mt-12 max-w-3xl px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-2 shadow-sm">
          <div className="flex w-full items-center gap-3">
            <Search className="shrink-0 text-neutral-800" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search employers"
              placeholder="Search companies by name or keyword..."
              className="h-12 w-full bg-transparent text-sm font-medium text-[#111111] outline-none placeholder:text-slate-400 md:text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- COMPANIES GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-[#111111] md:text-lg">
            Showing {filteredCompanies.length}{" "}
            {filteredCompanies.length === 1 ? "Company" : "Companies"}
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </h2>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-sm font-semibold text-[#111111] hover:underline"
            >
              Reset Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium bg-white rounded-3xl border border-slate-200 shadow-sm">
            Loading companies directory...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="group relative flex h-full flex-col rounded-2xl border border-[#E5E5E5] bg-white p-6 transition-shadow hover:shadow-[0_12px_36px_-24px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <CompanyAvatar
                      name={company.name}
                      logoUrl={company.logoUrl}
                      fallback="Co"
                      className="w-16 h-16 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl text-2xl text-[#111111] border border-neutral-200/50 shrink-0 shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#111111] group-hover:text-[#111111] transition-colors leading-snug mb-1">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                        <Building2 size={13} className="text-[#111111]" />{" "}
                        Registered Partner
                      </div>
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-light">
                      {company.description}
                    </p>
                  )}

                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#111111] font-bold text-xs bg-[#F7F7F7] px-3 py-1.5 rounded-lg">
                      <Briefcase size={14} />
                      <span>
                        {company.jobs ? company.jobs.length : 0} Open
                        Opportunities
                      </span>
                    </div>

                    <Link
                      href={`/companies/${company.id}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 group-hover:text-[#111111] transition-colors"
                    >
                      <span>Profile</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <Building2 size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-lg font-bold text-slate-700">
                  No companies found matching &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 bg-[#111111] text-white font-bold py-2 px-5 rounded-xl text-sm"
                >
                  View All Companies
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
