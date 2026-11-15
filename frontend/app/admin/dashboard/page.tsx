// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/admin/dashboard/page.tsx
// Description: The client-side Admin Dashboard communicating with the NestJS backend.
// ============================================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Building2, Users, PlusCircle, Shield, ArrowRight, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    jobsCount: 0,
    companiesCount: 0,
    usersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const [jobsRes, companiesRes, usersRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/companies'),
          api.get('/users').catch(() => ({ data: [] })) // Fallback if endpoint restricted
        ]);

        setStats({
          jobsCount: jobsRes.data?.length || 0,
          companiesCount: companiesRes.data?.length || 0,
          usersCount: usersRes.data?.length || 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F7FE] flex items-center justify-center">
        <p className="text-slate-500 font-medium text-lg">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F7FE] pb-24">
      
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-br from-[#031130] to-[#185DF1] pt-12 pb-20 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Center</h1>
              <p className="text-blue-100/80 mt-1">Manage job listings, employers, and platform operations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/jobs/create" className="bg-white text-[#185DF1] hover:bg-blue-50 font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2">
              <PlusCircle size={18} /> Post New Job
            </Link>
            <button onClick={handleLogout} className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex items-center gap-6">
            <div className="w-16 h-16 bg-[#F3F7FE] text-[#185DF1] rounded-2xl flex items-center justify-center font-bold">
              <Briefcase size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Jobs</p>
              <h3 className="text-3xl font-extrabold text-[#031130] mt-1">{stats.jobsCount}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex items-center gap-6">
            <div className="w-16 h-16 bg-[#F3F7FE] text-[#185DF1] rounded-2xl flex items-center justify-center font-bold">
              <Building2 size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Partner Companies</p>
              <h3 className="text-3xl font-extrabold text-[#031130] mt-1">{stats.companiesCount}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex items-center gap-6">
            <div className="w-16 h-16 bg-[#F3F7FE] text-[#185DF1] rounded-2xl flex items-center justify-center font-bold">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
              <h3 className="text-3xl font-extrabold text-[#031130] mt-1">{stats.usersCount}</h3>
            </div>
          </div>

        </div>

        {/* --- QUICK ACTIONS & MANAGEMENT LINKS --- */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-[#031130] mb-6">Management Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Link href="/admin/jobs/manage" className="p-6 bg-[#F3F7FE] rounded-2xl border border-slate-200 hover:border-[#185DF1] transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#185DF1] shadow-sm">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#031130] text-lg group-hover:text-[#185DF1] transition-colors">Manage Job Postings</h3>
                  <p className="text-sm text-slate-500">Edit, update, or request deletion of active listings</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-400 group-hover:text-[#185DF1] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href="/admin/companies/manage" className="p-6 bg-[#F3F7FE] rounded-2xl border border-slate-200 hover:border-[#185DF1] transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#185DF1] shadow-sm">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#031130] text-lg group-hover:text-[#185DF1] transition-colors">Manage Companies</h3>
                  <p className="text-sm text-slate-500">Register new employers and update company profiles</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-400 group-hover:text-[#185DF1] group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}