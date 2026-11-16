// ============================================================================
// File Name: not-found.tsx
// Exact Location: frontend/app/not-found.tsx
// Description: Custom 404 error page matching the platform theme.
// ============================================================================

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <AlertTriangle size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight mb-2">Page Not Found</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          href="/" 
          className="bg-[#111111] hover:bg-[#111111] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg inline-flex items-center gap-2 w-full justify-center"
        >
          <ArrowLeft size={18} /> Back to Homepage
        </Link>
      </div>
    </div>
  );
}