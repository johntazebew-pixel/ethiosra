// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/superadmin/approvals/page.tsx
// Description: The SuperAdmin Deletion Approvals queue with detailed reason inspection,
//              1-click Approve / Reject, and integration with SuperAdminNav.
// ============================================================================

"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Building2,
  Briefcase,
  AlertCircle,
  Clock,
  Eye,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import SuperAdminNav from "@/components/layout/SuperAdminNav";

export default function SuperAdminApprovalsPage() {
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPendingApprovals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/approvals/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingJobs(response.data || []);
    } catch (err) {
      console.error("Failed to fetch pending approvals", err);
      setPendingJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleReview = async (jobId: string, isApproved: boolean) => {
    setActionMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/approvals/${jobId}/review`,
        { isApproved },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setActionMessage(
        isApproved
          ? "Deletion request approved. Job has been permanently archived."
          : "Deletion request rejected. Job has been restored to active listings."
      );

      fetchPendingApprovals();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to process review. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F7FE] pb-24">
      <SuperAdminNav />

      {/* --- HEADER --- */}
      <div className="bg-gradient-to-br from-[#031130] via-[#081d4a] to-[#185DF1] pt-10 pb-20 px-4 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link
              href="/superadmin/dashboard"
              className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white font-medium mb-4 text-xs transition-colors"
            >
              <ArrowLeft size={14} /> Back to command center
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg shrink-0">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Job Deletion Approvals Queue
                </h1>
                <p className="text-blue-100/80 text-xs md:text-sm mt-0.5">
                  Review and authorize or reject pending vacancy removal requests submitted by administrators.
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block">
              Pending Authorization
            </span>
            <span className="text-3xl font-black text-amber-300">{pendingJobs.length}</span>
          </div>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-6xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
          {actionMessage && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <h2 className="text-lg font-bold text-[#031130] mb-6">
            Pending Review Requests ({pendingJobs.length})
          </h2>

          {loading ? (
            <div className="py-16 text-center text-slate-400 font-medium">
              <div className="w-10 h-10 border-4 border-[#185DF1] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading approval requests...
            </div>
          ) : pendingJobs.length > 0 ? (
            <div className="space-y-6">
              {pendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 bg-[#F8FAFC] rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-[#185DF1] font-bold shadow-sm shrink-0 uppercase border border-slate-200">
                      {job.company?.name ? job.company.name.substring(0, 2) : "ET"}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="font-bold text-[#031130] text-lg">{job.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building2 size={13} className="text-[#185DF1]" />
                          <span>{job.company?.name || "Independent Employer"}</span>
                          <span>•</span>
                          <span>Deadline: {new Date(job.deadlineDate).toLocaleDateString()}</span>
                        </p>
                      </div>

                      <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl">
                        <p className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Clock size={12} /> Stated Reason for Removal:
                        </p>
                        <p className="text-xs text-amber-950 font-medium italic">
                          &quot;{job.deletionReason || "No explanation provided by requester."}&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleReview(job.id, false)}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-200 transition-all text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <XCircle size={15} className="text-red-500" />
                      <span>Reject & Restore</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReview(job.id, true)}
                      className="bg-[#185DF1] hover:bg-[#031130] text-white font-bold py-2.5 px-5 rounded-xl transition-all text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                    >
                      <CheckCircle size={15} />
                      <span>Approve Removal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 font-medium bg-[#F3F7FE] rounded-2xl border border-slate-200">
              <AlertCircle size={36} className="mx-auto mb-2 text-slate-300" />
              <p>No pending deletion requests found. All listings are in good standing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}