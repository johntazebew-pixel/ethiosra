// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/jobs/[id]/page.tsx
// Description: Detailed job vacancy view displaying multi-categories,
//              compensation, workplace type, skills, responsibilities, and perks.
// ============================================================================

"use client";

import { useState, useEffect, Suspense } from "react";
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  Building2, 
  CheckCircle, 
  ExternalLink, 
  Share2, 
  Bookmark,
  ChevronLeft,
  DollarSign,
  Award,
  Layers,
  GraduationCap,
  Users,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

function JobDetailsContent() {
  const params = useParams();
  const id = params?.id;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchJobDetails() {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F7FE] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#185DF1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium text-lg">Loading job vacancy details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F3F7FE] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-[#031130] mb-2">Job vacancy not found</h2>
        <p className="text-slate-500 mb-6">The opportunity you are looking for may have expired or been removed.</p>
        <Link href="/" className="bg-[#185DF1] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#031130] transition-colors">
          Back to Homepage
        </Link>
      </div>
    );
  }

  const formatSalary = () => {
    if (job.isSalaryNegotiable || (!job.salaryMin && !job.salaryMax)) {
      return "Competitive / Negotiable";
    }
    const curr = job.salaryCurrency || "ETB";
    const period = job.salaryPeriod ? `/${job.salaryPeriod.toLowerCase()}` : "/mo";
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${curr} ${period}`;
    }
    if (job.salaryMin) return `From ${job.salaryMin.toLocaleString()} ${curr} ${period}`;
    if (job.salaryMax) return `Up to ${job.salaryMax.toLocaleString()} ${curr} ${period}`;
    return "Competitive / Negotiable";
  };

  return (
    <div className="min-h-screen bg-[#F3F7FE] pb-24">
      
      {/* --- TOP HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-14 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-8">
          
          <div className="flex flex-col md:flex-row gap-6 md:items-start w-full">
            
            <Link href="/" className="inline-flex items-center gap-1 text-[#185DF1] font-medium hover:underline text-sm md:hidden mb-2">
              <ChevronLeft size={16} /> Back to all jobs
            </Link>

            <div className="flex gap-6 w-full">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-[#F3F7FE] rounded-2xl flex items-center justify-center font-bold text-3xl md:text-4xl text-[#185DF1] border border-[#185DF1]/10 shrink-0 shadow-inner uppercase">
                {job.company?.name ? job.company.name.substring(0, 2) : "ET"}
              </div>
              
              <div className="flex-1">
                <div className="hidden md:flex items-center gap-3 mb-2">
                  <Link href="/" className="inline-flex items-center gap-1 text-[#185DF1] font-medium hover:underline text-sm">
                    <ChevronLeft size={16} /> Back to jobs
                  </Link>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 text-xs font-semibold">
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-4xl font-extrabold text-[#031130] tracking-tight mb-3 leading-tight">
                  {job.title}
                </h1>
                
                {/* Meta Attributes Row */}
                <div className="flex flex-wrap items-center gap-3 text-slate-600 font-medium text-sm mb-3">
                  <div className="flex items-center gap-1.5 font-bold text-[#185DF1]">
                    <Building2 size={18} />
                    <span>{job.company?.name || "Independent Employer"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={18} className="text-slate-400" />
                    <span>{job.location || "Addis Ababa"} ({job.workplaceType || "On-site"})</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 text-xs">
                    <DollarSign size={14} />
                    <span>{formatSalary()}</span>
                  </div>
                </div>

                {/* Multi-Categories Tags */}
                {job.categories && job.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {job.categories.map((jc: any, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-blue-50 text-[#185DF1] px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100"
                      >
                        <Layers size={12} />
                        {jc.category?.name || "Category"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[280px] shrink-0 mt-4 md:mt-0">
            <a 
              href={job.applicationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-[#185DF1] hover:bg-[#031130] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group text-center text-sm"
            >
              Apply for Vacancy <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
          
        </div>
      </div>

      {/* --- MAIN CONTENT & SIDEBAR --- */}
      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Job Content */}
        <div className="lg:w-2/3 flex flex-col gap-8">
          
          {/* Overview */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-[#031130] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase size={20} className="text-[#185DF1]" />
              <span>Role Overview</span>
            </h2>
            <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {job.description}
            </div>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && (
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-[#031130] border-b border-slate-100 pb-3 flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500" />
                <span>Key Responsibilities & Duties</span>
              </h2>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {job.responsibilities}
              </div>
            </div>
          )}

          {/* Qualifications & Requirements */}
          {job.qualifications && (
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-[#031130] border-b border-slate-100 pb-3 flex items-center gap-2">
                <GraduationCap size={20} className="text-[#185DF1]" />
                <span>Required Qualifications & Skills</span>
              </h2>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {job.qualifications}
              </div>
            </div>
          )}

          {/* Required Skills Chips */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#031130] flex items-center gap-2">
                <Award size={18} className="text-[#185DF1]" />
                <span>Essential Technical & Professional Skills</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill: string, sIdx: number) => (
                  <span
                    key={sIdx}
                    className="bg-[#F3F7FE] text-[#185DF1] border border-blue-200/80 px-3.5 py-1.5 rounded-xl text-xs font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits & Perks */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#031130] flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                <span>Company Benefits & Perks</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {job.benefits.map((b: string, bIdx: number) => (
                  <div key={bIdx} className="flex items-center gap-2 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-900">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* About Company Card */}
          {job.company && (
            <div className="bg-[#031130] text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#185DF1] rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-3">About {job.company.name}</h2>
                <p className="text-blue-100/80 text-sm md:text-base leading-relaxed mb-6">
                  {job.company.description || "Leading organization offering rewarding career opportunities across Ethiopia."}
                </p>
                {job.company.website && (
                  <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white font-bold hover:text-[#185DF1] transition-colors text-sm">
                    Visit Official Website <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Sticky Summary Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24 space-y-6">
            <h3 className="text-lg font-bold text-[#031130] border-b border-slate-100 pb-3">Vacancy Summary</h3>
            
            <div className="space-y-5 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-[#185DF1] rounded-xl flex items-center justify-center shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Application Deadline</p>
                  <p className="text-[#031130] font-bold">{new Date(job.deadlineDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Compensation</p>
                  <p className="text-[#031130] font-bold">{formatSalary()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Contract & Seniority</p>
                  <p className="text-[#031130] font-bold">
                    {job.employmentType || "Full-Time"} • {job.experienceLevel || "Mid-Level"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Min Experience</p>
                  <p className="text-[#031130] font-bold">
                    {job.minExperienceYears ? `${job.minExperienceYears} Years` : "Fresh Graduate / Open"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Minimum Education</p>
                  <p className="text-[#031130] font-bold">{job.educationLevel || "Bachelor's Degree"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Open Positions</p>
                  <p className="text-[#031130] font-bold">{job.positionsCount || 1} Vacancy</p>
                </div>
              </div>
            </div>
            
            <hr className="my-6 border-slate-100" />
            
            <a 
              href={job.applicationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#185DF1] hover:bg-[#031130] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm text-center"
            >
              <span>Submit Application</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function JobDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F3F7FE] flex items-center justify-center">
        <p className="text-slate-500 font-medium">Loading...</p>
      </div>
    }>
      <JobDetailsContent />
    </Suspense>
  );
}