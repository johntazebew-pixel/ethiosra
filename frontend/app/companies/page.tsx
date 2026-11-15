// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/companies/page.tsx
// Description: The client-side Companies directory with live search and profiles.
// ============================================================================

"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Building2, Briefcase, ArrowRight, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await api.get('/companies');
        setCompanies(response.data || []);
      } catch (error) {
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
    <div className="min-h-screen bg-[#F3F7FE] pb-24">
      {/* --- HEADER SECTION --- */}
      <div className="bg-gradient-to-br from-[#031130] via-[#081d4a] to-[#185DF1] pt-20 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#185DF1] rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-blue-200 mb-4">
            <Building2 size={14} />
            <span>Verified Organizations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Top Employers in Ethiopia
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 font-light max-w-2xl mx-auto">
            Discover premier companies, explore their teams and open positions, and apply directly.
          </p>
        </div>
      </div>

      {/* --- SEARCH BAR (Floating) --- */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20 mb-12">
        <div className="bg-white p-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
            <Search className="text-[#185DF1] shrink-0" size={22} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name or keyword..." 
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
            className="bg-[#185DF1] hover:bg-[#031130] text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md text-sm md:text-base shrink-0"
          >
            Search
          </button>
        </div>
      </div>

      {/* --- COMPANIES GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#031130]">
            Showing {filteredCompanies.length} {filteredCompanies.length === 1 ? 'Company' : 'Companies'}
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </h2>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-sm font-semibold text-[#185DF1] hover:underline"
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
              filteredCompanies.map((company: any) => (
                <div 
                  key={company.id} 
                  className="bg-white rounded-3xl p-7 border border-slate-200/90 hover:border-[#185DF1]/50 hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center font-bold text-2xl text-[#185DF1] border border-blue-200/50 shrink-0 uppercase shadow-sm">
                      {company.name ? company.name.substring(0, 2) : "Co"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#031130] group-hover:text-[#185DF1] transition-colors leading-snug mb-1">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                        <Building2 size={13} className="text-[#185DF1]" /> Registered Partner
                      </div>
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-light">
                      {company.description}
                    </p>
                  )}

                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#185DF1] font-bold text-xs bg-[#F3F7FE] px-3 py-1.5 rounded-lg">
                      <Briefcase size={14} />
                      <span>{company.jobs ? company.jobs.length : 0} Open Opportunities</span>
                    </div>

                    <Link 
                      href={`/companies/${company.id}`} 
                      className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 group-hover:text-[#185DF1] transition-colors"
                    >
                      <span>Profile</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <Building2 size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-lg font-bold text-slate-700">No companies found matching &ldquo;{searchQuery}&rdquo;</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 bg-[#185DF1] text-white font-bold py-2 px-5 rounded-xl text-sm"
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