// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/companies/[id]/page.tsx
// Description: The dynamic client-side Company Profile page fetching live data by ID.
// ============================================================================

"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { Building2, MapPin, Globe, Briefcase, ArrowRight, ChevronLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import CompanyAvatar from "@/components/ui/CompanyAvatar";

function CompanyProfileContent() {
  const params = useParams();
  const id = params?.id;

  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchCompanyProfile() {
      try {
        const response = await api.get(`/companies/${id}`);
        setCompany(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <p className="text-slate-500 font-medium text-lg">Loading company profile...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-[#111111] mb-2">Company not found</h2>
        <p className="text-slate-500 mb-6">The organization you are looking for does not exist or has been removed.</p>
        <Link href="/companies" className="bg-[#111111] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#111111] transition-colors">
          Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-gradient-to-br from-[#111111] to-[#111111] pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#111111] rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/companies" className="inline-flex items-center gap-1 text-neutral-200 hover:text-white font-medium mb-8 text-sm transition-colors">
            <ChevronLeft size={16} /> Back to all companies
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-white">
            <CompanyAvatar
              name={company.name}
              logoUrl={company.logoUrl}
              fallback="Co"
              className="w-24 h-24 bg-white rounded-2xl text-3xl text-[#111111] shadow-lg shrink-0"
            />
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {company.name}
              </h1>
              <p className="text-neutral-100/80 font-light text-lg mb-4 max-w-2xl">
                {company.description || "A registered hiring employer contributing to the professional growth of Ethiopia."}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-100 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-neutral-300" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline text-white font-bold">
                    <Globe size={18} className="text-neutral-300" />
                    <span>{company.website}</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- OPEN JOBS SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#111111] tracking-tight">Open Positions</h2>
            <p className="text-slate-500 mt-1">Currently hiring at {company.name}</p>
          </div>
          <div className="bg-[#111111]/10 text-[#111111] font-bold px-4 py-2 rounded-xl text-sm">
            {company.jobs ? company.jobs.length : 0} Active Roles
          </div>
        </div>

        {company.jobs && company.jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {company.jobs.map((job: any) => (
              <div key={job.id} className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-[#111111]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                      {job.applicationMethod}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Deadline: {new Date(job.deadlineDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#111111] group-hover:text-[#111111] transition-colors mb-2">
                    {job.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                    {job.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                    <MapPin size={16} className="text-[#111111]" /> Addis Ababa
                  </div>
                  <Link href={`/jobs/${job.id}`} className="bg-[#F7F7F7] text-[#111111] group-hover:bg-[#111111] group-hover:text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2">
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-[#111111] mb-1">No open positions right now</h3>
            <p className="text-slate-400 text-sm">Check back later for new career opportunities from {company.name}.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CompanyProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
          <p className="text-slate-500 font-medium text-lg">Loading company profile...</p>
        </div>
      }
    >
      <CompanyProfileContent />
    </Suspense>
  );
}