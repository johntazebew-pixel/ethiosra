// ============================================================================
// File Name: error.tsx
// Exact Location: frontend/app/error.tsx
// Description: Global error boundary handling runtime exceptions gracefully.
// ============================================================================

"use client";

import { useEffect } from "react";
import { RefreshCw, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F3F7FE] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldAlert size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-[#031130] tracking-tight mb-2">Something went wrong</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          An unexpected error occurred while processing your request. Please try again or return home.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-[#185DF1] hover:bg-[#031130] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Try Again
          </button>
          <Link
            href="/"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-8 rounded-xl transition-all block text-center"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}   