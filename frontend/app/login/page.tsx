// ============================================================================
// File Name: page.tsx
// Exact Location: frontend/app/login/page.tsx
// Description: The client-side login page communicating with the NestJS Auth backend.
// ============================================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { isAxiosError } from "axios";
import Link from "next/link";
import { api } from "@/lib/api";
import { SiteMark } from "@/components/layout/BrandingProvider";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Save token securely in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("auth-change"));
      }

      // Redirect user based on their role
      const role = response.data?.user?.role;
      if (role === "SUPERADMIN") {
        router.push("/superadmin/dashboard");
      } else if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setErrorMessage(
        message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F7F7F7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <SiteMark />
          <span className="text-2xl font-bold tracking-tight text-[#111111]">
            Ethio<span className="text-[#111111]">Sira</span>
          </span>
        </Link>
        <h2 className="text-3xl font-semibold text-[#111111] tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to access your dashboard and manage applications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-[#E5E5E5] sm:px-10">
          
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#F7F7F7] border border-slate-200 rounded-lg text-[#111111] font-medium focus:outline-none focus:ring-2 focus:ring-neutral-700/20 focus:border-neutral-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-[#F7F7F7] border border-slate-200 rounded-lg text-[#111111] font-medium focus:outline-none focus:ring-2 focus:ring-neutral-700/20 focus:border-neutral-700 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] hover:bg-[#2D2D2D] text-white font-semibold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold text-[#111111] hover:underline">
                Register as Job Seeker
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}